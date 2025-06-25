import dotenv from 'dotenv';
dotenv.config();
import { fetchPosts } from './fetchPosts';
import Typesense from "typesense";
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { Post } from '@/db/schema';

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




async function seedTypesense() {
  console.log("start seeding... ")
  const collectionName = "posts";
  
  try {
    const typesense = new Typesense.Client({ 
      nodes: [
        {
          host: process.env.TYPESENSE_HOST as string,
          port: parseInt(process.env.TYPESENSE_PORT as string),
          protocol: process.env.TYPESENSE_PROTOCOL as string
        }
      ],
      apiKey: process.env.TYPESENSE_API_KEY as string
    }); 
    // check if collection exist
    // const isCollectionExist = await typesense.collections(collectionName).exists();
    // const postsCollection = (await typesense.collections(collectionName).retrieve()).num_documents;
    // console.log(isCollectionExist ? "Collection exists" : "Collection does not exist");
    // console.log(postsCollection ? "Collection has " + postsCollection + " documents" : "Collection has no documents");
    
    const isCollectionExist = await typesense.collections(collectionName).exists();
    if (!isCollectionExist) {
      console.log('Collection does not exist. Creating schema...');
      await typesense.collections().create(postsSchema as CollectionCreateSchema);
    } else {
      console.log('Collection exists. delete schema...');
      await typesense.collections(collectionName).delete();
      await typesense.collections().create(postsSchema as CollectionCreateSchema);
    }
    const postsResult = await fetchPosts();
    if (!postsResult.success) {
      console.error(' Failed to fetch posts:', postsResult.error);
      return false;
    }

    const posts = postsResult.data.map((post:Post)=>{
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
      }
    });
    console.log("Importing data to Typesense...")
    await typesense.collections(collectionName)
    .documents()
    .import(posts);
    console.log("Importing data to Typesense... done")
    const collection = await typesense.collections(collectionName).retrieve()
    console.log("Collection created with " + collection.num_documents + " documents");
    console.log(" Seeding completed successfully");
    return true;

  } catch (error) {
    console.error(' Error during seeding:', error);
    return false;
  }finally{
    console.log("Seeding completed successfully");
    return
  }
}
seedTypesense();





export { seedTypesense }; 