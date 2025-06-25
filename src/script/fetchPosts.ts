import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { postsTable } from '../db/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function fetchPosts() {
  try {
    const client = postgres(process.env.DATABASE_URL!);
    const db = drizzle(client);

    // Query all posts from posts table
    const posts = await db
      .select()
      .from(postsTable);

    if (posts.length > 0) {
      console.log(`Found ${posts.length} posts in database`);
    } else {
      console.log(' No posts found in database');
    }

    await client.end();
    console.log('🔌 Database connection closed');
    
    return {
      success: true,
      data: posts,
      count: posts.length
    };
  } catch (error) {
    console.error(' Error connecting to database:', error instanceof Error ? error.message : String(error));
    return {
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}