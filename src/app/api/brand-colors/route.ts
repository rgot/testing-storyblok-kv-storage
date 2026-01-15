import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const accessToken = process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN;

        if (!accessToken) {
            return NextResponse.json(
                { message: 'STORYBLOK_ACCESS_TOKEN is not defined' },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://api.storyblok.com/v2/cdn/stories/config/brand-colors?token=${accessToken}&version=draft`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://app.storyblok.com'
                },
            }
        );

        const data = await response.json();

        const kvpairs = data.story.content.pairs.map((p: { value: string; key: string }) => {
            return {
                value: p.value,
                key: p.key
            }
        } );

        return NextResponse.json(kvpairs);
    } catch (error) {
        console.error('Error fetching brand colors:', error);
        return NextResponse.json(
            {
                message: 'Failed to fetch brand colors',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}