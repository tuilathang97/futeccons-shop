import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const path = searchParams.get('path');
        const tag = searchParams.get('tag');
        const secret = searchParams.get('secret');

        // Check for secret to prevent unauthorized revalidation
        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ 
                error: 'Invalid secret' 
            }, { status: 401 });
        }

        if (path) {
            // Revalidate specific path
            revalidatePath(path);
            console.log(`Revalidated path: ${path}`);
            return NextResponse.json({ 
                message: `Path ${path} revalidated successfully`,
                revalidated: true,
                now: Date.now()
            });
        }

        if (tag) {
            // Revalidate by tag
            revalidateTag(tag);
            console.log(`Revalidated tag: ${tag}`);
            return NextResponse.json({ 
                message: `Tag ${tag} revalidated successfully`,
                revalidated: true,
                now: Date.now()
            });
        }

        return NextResponse.json({ 
            error: 'Missing path or tag parameter' 
        }, { status: 400 });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error' 
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        // Check for secret to prevent unauthorized access
        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ 
                error: 'Invalid secret' 
            }, { status: 401 });
        }

        return NextResponse.json({
            message: 'Revalidation API is working',
            availableActions: [
                'POST /api/revalidate?path=/some-path&secret=YOUR_SECRET',
                'POST /api/revalidate?tag=some-tag&secret=YOUR_SECRET'
            ],
            availableTags: [
                'posts',
                'posts:category',
                'posts:homepage',
                'posts:published',
                'categories',
                'categories:all',
                'categories:public'
            ]
        });
    } catch (error) {
        console.error('Revalidation API error:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error' 
        }, { status: 500 });
    }
}