import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeTranscriptService } from '@/lib/youtube-transcript';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    const transcriptService = getYouTubeTranscriptService();
    
    // Extract video ID from URL
    const videoId = transcriptService.extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Fetch metadata first (this is more likely to succeed)
    let metadata;
    try {
      metadata = await transcriptService.getVideoMetadata(videoId);
    } catch (metadataError) {
      console.error('Metadata fetch error:', metadataError);
      metadata = {
        title: `Video ${videoId}`,
        description: 'Unable to fetch video details',
        duration: 'Unknown',
        channel: 'Unknown Channel'
      };
    }

    // Then try to fetch transcript
    let transcript;
    try {
      transcript = await transcriptService.fetchTranscript(videoId);
    } catch (transcriptError) {
      console.error('Transcript fetch error:', transcriptError);
      return NextResponse.json({
        videoId,
        metadata,
        transcript: [],
        success: false,
        error: 'No transcript available for this video. The video might not have captions enabled, or the captions might be auto-generated and not accessible.'
      });
    }

    if (!transcript || transcript.length === 0) {
      return NextResponse.json({
        videoId,
        metadata,
        transcript: [],
        success: false,
        error: 'No transcript data found. The video might not have captions.'
      });
    }

    return NextResponse.json({
      videoId,
      metadata,
      transcript,
      success: true
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch transcript',
        details: 'The video might not have captions available, or there was an error accessing YouTube.'
      },
      { status: 500 }
    );
  }
}