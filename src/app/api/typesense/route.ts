import { NextResponse } from 'next/server'
import Typesense from 'typesense'
import dotenv from 'dotenv'
dotenv.config()

const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || '172.18.11.180',
      port: Number(process.env.TYPESENSE_PORT) || 8108,
      protocol: process.env.TYPESENSE_PROTOCOL || 'https',
      path: process.env.TYPESENSE_PATH || ''
    }
  ],
  apiKey: process.env.TYPESENSE_API_KEY as string,
  connectionTimeoutSeconds: 2
});


export async function POST(request: Request) {
  const { query } = await request.json()

  const searchParameters = {
    'q'         : query,
    'query_by'  : ['tieuDeBaiViet', 'noiDung', 'thanhPho', 'quan', 'phuong', 'duong'],
    'sort_by'   : 'giaTien:desc'
  }
  
  try{
    const res = await client.collections('posts')
    .documents()
    .search(searchParameters)
    .then((res) => {
      console.log("co " + res?.hits?.length + " ket qua")
      return res
    })  
    return NextResponse.json({ data: res?.hits?.map((hit: any) => hit.document) })
  } catch (error) {
    console.error('Error searching Typesense:', error)
    return NextResponse.json({data:[]})
  }
} 