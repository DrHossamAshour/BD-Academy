import { NextRequest, NextResponse } from 'next/server';

const VIMEO_TOKEN = "be9a99823ebe2f7b7212d33ce3594e74";

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID from Vimeo URL
    const vimeoRegex = /https:\/\/player\.vimeo\.com\/video\/(\d+)\?.*/;
    const match = videoUrl.match(vimeoRegex);

    if (!match) {
      return NextResponse.json(
        { error: 'Invalid Vimeo player URL format' },
        { status: 400 }
      );
    }

    const videoId = match[1];

    // Fetch video details from Vimeo API
    const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
      headers: {
        'Authorization': `Bearer ${VIMEO_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch video from Vimeo API' },
        { status: response.status }
      );
    }

    const videoData = await response.json();

    // Check video protection status
    const isProtected = videoData.privacy?.view === 'nobody' || 
                       videoData.privacy?.view === 'contacts' ||
                       videoData.privacy?.view === 'password';

    // Check if video is downloadable
    const isDownloadable = videoData.privacy?.download === true;

    // Check if video is embeddable
    const isEmbeddable = videoData.privacy?.embed === 'whitelist' || 
                        videoData.privacy?.embed === 'public';

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        title: videoData.name,
        duration: videoData.duration,
        isProtected,
        isDownloadable,
        isEmbeddable,
        privacy: videoData.privacy,
        status: isProtected ? 'protected' : 'public'
      }
    });

  } catch (error) {
    console.error('Vimeo validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 