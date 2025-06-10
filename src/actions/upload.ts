'use server';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';

const MAX_UPLOADS = 10;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Generate consistent directory structure
function getStoragePath(filename: string) {
  const now = new Date();
  const hash = createHash('sha256').update(filename).digest('hex');
  return {
    dir: join(
      String(now.getUTCFullYear()),
      String(now.getUTCMonth() + 1).padStart(2, '0'),
      String(now.getUTCDate()).padStart(2, '0'),
      hash.substring(0, 2),
      hash.substring(2, 4)
    ),
    filename: `${hash}`
  };
}

async function processImage(buffer: Buffer, outputPath: string, options: {
  width: number;
  height: number;
  format: 'webp';
}) {
  const { width, height, format } = options;
  
  return sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
      withoutEnlargement: true
    })
    .toFormat(format, {
      quality: 80,
      effort: 6
    })
    .toFile(outputPath);
}

export async function uploadImages(prevState: any, formData: FormData) {
  const files = formData.getAll('images') as File[];
  const uploadHash = uuidv4();
  const baseDir = join(process.cwd(), 'public/uploads');

  try {
    // Validation
    if (files.length > MAX_UPLOADS) throw new Error('Maximum 10 images allowed');
    
    const processed = await Promise.all(
      files.map(async (file) => {
        if (file.size > MAX_SIZE) throw new Error('File too large');
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const { dir, filename } = getStoragePath(uploadHash + file.name);
        const outputDir = join(baseDir, dir);
        
        await mkdir(outputDir, { recursive: true });

        // Generate square version (1:1)
        const squarePath = join(outputDir, `${filename}-square.webp`);
        await processImage(buffer, squarePath, {
          width: 800,
          height: 800,
          format: 'webp'
        });

        // Generate carousel version (16:9)
        const carouselPath = join(outputDir, `${filename}-carousel.webp`);
        await processImage(buffer, carouselPath, {
          width: 1200,
          height: 675, // 1200 * (9/16) = 675
          format: 'webp'
        });

        return {
          square: join('/uploads', dir, `${filename}-square.webp`),
          carousel: join('/uploads', dir, `${filename}-carousel.webp`)
        };
      })
    );

    return { success: true, images: processed };
  } catch (error: any) {
    return { error: error.message || 'Upload failed' };
  }
}