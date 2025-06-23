import { NextRequest, NextResponse } from 'next/server';
import { videoAnalysisService } from '@/lib/video-analysis-service';

export async function POST(request: NextRequest) {
  try {
    const { videoId, intervalSeconds = 15 } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Fetch transcript
    const transcript = await videoAnalysisService.fetchVideoTranscript(videoId);

    // Generate AI explanations
    const explanations = await videoAnalysisService.generateExplanations(
      transcript,
      intervalSeconds
    );

    return NextResponse.json({
      success: true,
      videoId,
      explanationCount: explanations.length,
      explanations,
      hasAI: !!process.env.OPENAI_API_KEY
    });
  } catch (error) {
    console.error('Error analyzing video:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    hasAI: !!process.env.OPENAI_API_KEY,
    message: process.env.OPENAI_API_KEY 
      ? 'AI analysis is enabled' 
      : 'Add OPENAI_API_KEY to enable AI analysis'
  });
}