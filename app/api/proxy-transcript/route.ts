import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Use a transcript proxy service (for demonstration)
    // In production, you would use your own implementation
    const transcriptUrl = `https://youtube-transcript-api.vercel.app/api/transcript?videoId=${videoId}`;
    
    try {
      const response = await fetch(transcriptUrl);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Transform the response to match our format
      const transcript = data.transcript?.map((item: any) => ({
        timestamp: formatTimestamp(item.start),
        text: item.text,
        startTime: item.start,
        duration: item.duration
      })) || [];
      
      return NextResponse.json({
        success: true,
        transcript
      });
    } catch (error) {
      // Fallback: Return sample transcript for demo
      return NextResponse.json({
        success: false,
        transcript: getSampleTranscript(),
        message: 'Using sample transcript for demo. Real transcripts require proper API setup.'
      });
    }
  } catch (error) {
    console.error('Proxy transcript error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function getSampleTranscript() {
  return [
    { timestamp: "0:00", text: "Welcome to this programming tutorial", startTime: 0, duration: 3 },
    { timestamp: "0:03", text: "Today we'll be building an application", startTime: 3, duration: 3 },
    { timestamp: "0:06", text: "Let's start by setting up our project", startTime: 6, duration: 3 },
    { timestamp: "0:09", text: "First, we need to create our components", startTime: 9, duration: 3 },
    { timestamp: "0:12", text: "This is where we'll write our main logic", startTime: 12, duration: 3 },
    { timestamp: "0:15", text: "Notice how we're using best practices here", startTime: 15, duration: 3 },
    { timestamp: "0:18", text: "This pattern is commonly used in production", startTime: 18, duration: 3 },
    { timestamp: "0:21", text: "Let me explain why this approach is better", startTime: 21, duration: 3 },
    { timestamp: "0:24", text: "By organizing our code this way", startTime: 24, duration: 3 },
    { timestamp: "0:27", text: "We make it more maintainable and scalable", startTime: 27, duration: 3 },
  ];
}