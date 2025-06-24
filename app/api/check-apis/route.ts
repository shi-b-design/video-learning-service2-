import { NextResponse } from 'next/server';

export async function GET() {
  const results = {
    openai: false,
    youtube: false,
    messages: [] as string[]
  };

  // Check OpenAI API
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_')) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });
      results.openai = response.ok;
      if (!response.ok) {
        results.messages.push(`OpenAI API error: ${response.status}`);
      }
    } catch (error) {
      results.messages.push('OpenAI API connection failed');
    }
  } else {
    results.messages.push('OpenAI API key not configured');
  }

  // Check YouTube API
  if (process.env.YOUTUBE_API_KEY && !process.env.YOUTUBE_API_KEY.includes('your_')) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=dQw4w9WgXcQ&part=snippet&key=${process.env.YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      results.youtube = !data.error;
      if (data.error) {
        results.messages.push(`YouTube API error: ${data.error.message}`);
      }
    } catch (error) {
      results.messages.push('YouTube API connection failed');
    }
  } else {
    results.messages.push('YouTube API key not configured (optional)');
  }

  return NextResponse.json(results);
}