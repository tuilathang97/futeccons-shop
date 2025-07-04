import dotenv from 'dotenv';
dotenv.config();
import { fetchPosts } from './fetchPosts';
import Typesense from "typesense";
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { Post } from '@/db/schema';

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;

function log(level: 'INFO' | 'ERROR' | 'WARN', message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

function validateEnvironment(): boolean {
  const requiredEnvVars = [
    'TYPESENSE_HOST',
    'TYPESENSE_PORT', 
    'TYPESENSE_PROTOCOL',
    'TYPESENSE_API_KEY',
    'DATABASE_URL'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log('ERROR', `Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}

const postsSchema = {
  name: 'posts',
  fields: [
    { name: 'id', type: 'int32' },
    { name: 'userId', type: 'string' },
    { name: 'active', type: 'bool' },

    // Categories
    { name: 'level1Category', type: 'int32' },
    { name: 'level2Category', type: 'int32' },
    { name: 'level3Category', type: 'int32' },
    { name: 'path', type: 'string', optional: true },

    // Location fields
    { name: 'thanhPho', type: 'string', facet: true },
    { name: 'thanhPhoCodeName', type: 'string' },
    { name: 'quan', type: 'string', facet: true },
    { name: 'quanCodeName', type: 'string' },
    { name: 'phuong', type: 'string', facet: true },
    { name: 'phuongCodeName', type: 'string' },
    { name: 'duong', type: 'string', facet: true },

    // Titles & content
    { name: 'tieuDeBaiViet', type: 'string', facet: true },
    { name: 'noiDung', type: 'string', facet: true },

    // Coordinates (chuyển về float đúng type)
    { name: 'latitude', type: 'float', optional: true },
    { name: 'longitude', type: 'float', optional: true },

    // Property details
    { name: 'giaTien', type: 'float' },
    { name: 'dienTichDat', type: 'float' },
    { name: 'dienTichSuDung', type: 'int32' },
    { name: 'soTang', type: 'int32' },
    { name: 'soPhongNgu', type: 'int32' },
    { name: 'soPhongVeSinh', type: 'int32' },

    { name: 'giayToPhapLy', type: 'string', },
    { name: 'loaiHinhNhaO', type: 'string', },
    { name: 'huongCuaChinh', type: 'string'},
    { name: 'chieuNgang', type: 'int32' },
    { name: 'chieuDai', type: 'int32' },

    // Timestamps
    { name: 'createdAt', type: 'int64' },
    { name: 'updatedAt', type: 'int64' }
  ],
  default_sorting_field: 'createdAt',
  default_sorting_order: 'desc',
};




async function seedTypesense(): Promise<boolean> {
  const collectionName = "posts";
  const startTime = Date.now();
  
  try {
    log('INFO', 'Starting Typesense seeding process...');
    
    if (!validateEnvironment()) {
      process.exit(EXIT_FAILURE);
    }
    
    log('INFO', 'Initializing Typesense client...');
    const typesense = new Typesense.Client({ 
      nodes: [
        {
          host: process.env.TYPESENSE_HOST as string,
          port: parseInt(process.env.TYPESENSE_PORT as string),
          protocol: process.env.TYPESENSE_PROTOCOL as string
        }
      ],
      apiKey: process.env.TYPESENSE_API_KEY as string,
      connectionTimeoutSeconds: 30,
      numRetries: 3
    }); 
    
    log('INFO', 'Checking collection existence...');
    const isCollectionExist = await typesense.collections(collectionName).exists();
    
    if (!isCollectionExist) {
      log('INFO', 'Collection does not exist. Creating schema...');
      await typesense.collections().create(postsSchema as CollectionCreateSchema);
    } else {
      log('INFO', 'Collection exists. Recreating schema...');
      await typesense.collections(collectionName).delete();
      await typesense.collections().create(postsSchema as CollectionCreateSchema);
    }
    
    log('INFO', 'Fetching posts from database...');
    const postsResult = await fetchPosts();
    
    if (!postsResult.success) {
      log('ERROR', `Failed to fetch posts: ${postsResult.error}`);
      process.exit(EXIT_FAILURE);
    }

    if (postsResult.data.length === 0) {
      log('WARN', 'No posts found in database. Nothing to sync.');
      return true;
    }

    log('INFO', `Processing ${postsResult.data.length} posts...`);
    const posts = postsResult.data.map((post: Post) => {
      try {
        return {
          ...post,
          id: post.id.toString(),
          active: post.active,
          userId: post.userId,
          level1Category: post.level1Category,
          level2Category: post.level2Category,
          level3Category: post.level3Category,
          path: post.path,
          thanhPho: post.thanhPho,
          quan: post.quan,
          phuong: post.phuong,
          duong: post.duong,
          giaTien: parseFloat(post.giaTien),
          dienTichDat: parseFloat(post.dienTichDat),
          dienTichSuDung: parseInt(post.dienTichSuDung.toString()),
          soTang: parseInt(post.soTang.toString()),
          soPhongNgu: parseInt(post.soPhongNgu.toString()),
          soPhongVeSinh: parseInt(post.soPhongVeSinh.toString()),
          giayToPhapLy: post.giayToPhapLy,
          loaiHinhNhaO: post.loaiHinhNhaO,
          huongCuaChinh: post.huongCuaChinh,
          chieuNgang: post.chieuNgang,
          chieuDai: post.chieuDai,
          latitude: parseFloat(post.latitude || "0"),
          longitude: parseFloat(post.longitude || "0"),
          thanhPhoCodeName: post.thanhPhoCodeName,
          quanCodeName: post.quanCodeName,
          phuongCodeName: post.phuongCodeName,
          createdAt: post.createdAt.getTime(),
          updatedAt: post.updatedAt.getTime(),
        };
      } catch (error) {
        log('ERROR', `Error processing post ${post.id}: ${error}`);
        throw error;
      }
    });
    
    log('INFO', `Importing ${posts.length} posts to Typesense...`);
    const importResult = await typesense.collections(collectionName)
      .documents()
      .import(posts);
    
    const duration = Date.now() - startTime;
    log('INFO', `Seeding completed successfully in ${duration}ms`);
    log('INFO', `Imported ${posts.length} posts to collection '${collectionName}'`);
    
    return true;

  } catch (error) {
    const duration = Date.now() - startTime;
    log('ERROR', `Seeding failed after ${duration}ms: ${error instanceof Error ? error.message : String(error)}`);
    
    if (error instanceof Error && error.stack) {
      log('ERROR', `Stack trace: ${error.stack}`);
    }
    
    process.exit(EXIT_FAILURE);
  }
}

// Main execution
async function main() {
  try {
    await seedTypesense();
    process.exit(EXIT_SUCCESS);
  } catch (error) {
    log('ERROR', `Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(EXIT_FAILURE);
  }
}

if (require.main === module) {
  main();
}





export { seedTypesense }; 