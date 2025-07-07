import { NextResponse } from 'next/server'
import Typesense from 'typesense'
import dotenv from 'dotenv'
dotenv.config()


console.log(process.env.TYPESENSE_HOST,process.env.TYPESENSE_PORT,process.env.TYPESENSE_PROTOCOL,
  process.env.TYPESENSE_PATH)


const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || '172.18.11.180',
      port: Number(process.env.TYPESENSE_PORT) || 8108,
      protocol:process.env.TYPESENSE_PROTOCOL || 'http',
      path: process.env.TYPESENSE_PATH || ''
    }
  ],
  apiKey: process.env.TYPESENSE_API_KEY as string,
  connectionTimeoutSeconds: 10,
  numRetries: 3
});

export async function POST(request: Request) {
  console.log({
    nodes: [
      // {
      //   host: process.env.TYPESENSE_HOST || '172.18.11.180',
      //   port: Number(process.env.TYPESENSE_PORT) || 8108,
      //   protocol:process.env.TYPESENSE_PROTOCOL || 'https',
      //   path: process.env.TYPESENSE_PATH || '/typesense'
      // }
      {
        host: process.env.TYPESENSE_HOST || '172.18.11.180',
        port: Number(process.env.TYPESENSE_PORT) || 8108,
        protocol:'http',
        path: ""
      }
    ]
  })
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ 
        success: false, 
        message: 'Query parameter is required and must be a string',
        data: [] 
      }, { status: 400 })
    }

    const searchParameters = {
      'q': query,
      'query_by': 'tieuDeBaiViet,noiDung,thanhPho,quan,phuong,duong',
      'sort_by': 'giaTien:desc',
      'per_page': 20
    }
    
    console.log('Searching with parameters:', searchParameters)
    
    const res = await client.collections('posts')
      .documents()
      .search(searchParameters)
    
    console.log(`Found ${res?.hits?.length || 0} results`)
    
    return NextResponse.json({ 
      success: true,
      data: res?.hits?.map((hit: any) => hit.document) || [],
      total: res?.found || 0,
      searchTime: res?.search_time_ms || 0
    })
    
  } catch (error) {
    console.error('Error searching Typesense:', error)
    
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      data: []
    }, { status: 500 })
  }
}

// Add GET method for testing
export async function GET() {
  try {
    // Test connection by getting collection info
    const collection = await client.collections('posts').retrieve()
    return NextResponse.json({
      success: true,
      message: 'Typesense connection successful',
      collection: {
        name: collection.name,
        num_documents: collection.num_documents,
        fields: collection.fields?.length
      }
    })
  } catch (error) {
    console.error('Error connecting to Typesense:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed',
    }, { status: 500 })
  }
} 