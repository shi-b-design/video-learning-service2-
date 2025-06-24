import { NextResponse } from 'next/server';

export async function GET() {
  const testVideoId = '9wiWzu_tRB0'; // React Todo List - known to have captions
  
  const results = {
    videoId: testVideoId,
    tests: [] as any[]
  };

  // Test 1: Direct youtube-transcript import
  try {
    const { YoutubeTranscript } = await import('youtube-transcript');
    results.tests.push({
      test: 'Import youtube-transcript',
      success: true,
      details: 'Package imported successfully'
    });

    // Test 2: Fetch transcript
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(testVideoId);
      results.tests.push({
        test: 'Fetch transcript',
        success: true,
        details: `Found ${transcript.length} segments`,
        sample: transcript[0]
      });
    } catch (e: any) {
      results.tests.push({
        test: 'Fetch transcript',
        success: false,
        error: e.message,
        stack: e.stack?.split('\n').slice(0, 5)
      });
    }

    // Test 3: Try different language codes
    const langCodes = ['en', 'en-US', 'en-GB'];
    for (const lang of langCodes) {
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(testVideoId, { lang });
        results.tests.push({
          test: `Fetch with lang=${lang}`,
          success: true,
          details: `Found ${transcript.length} segments`
        });
        break;
      } catch (e: any) {
        results.tests.push({
          test: `Fetch with lang=${lang}`,
          success: false,
          error: e.message
        });
      }
    }

  } catch (e: any) {
    results.tests.push({
      test: 'Import youtube-transcript',
      success: false,
      error: e.message,
      details: 'Failed to import package'
    });
  }

  // Test 4: Check environment
  results.tests.push({
    test: 'Environment check',
    success: true,
    details: {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV
    }
  });

  return NextResponse.json(results, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}