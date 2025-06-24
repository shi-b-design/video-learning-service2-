import { Innertube } from 'youtubei.js';
import { TranscriptSegment } from '@/types/enhanced-explanation';

export class YouTubeTranscriptAlternative {
  private innertube: Innertube | null = null;

  async initialize() {
    if (!this.innertube) {
      this.innertube = await Innertube.create();
    }
    return this.innertube;
  }

  async fetchTranscriptWithYouTubei(videoId: string): Promise<TranscriptSegment[]> {
    try {
      const youtube = await this.initialize();
      
      // Get video info
      const info = await youtube.getInfo(videoId);
      
      // Get transcript
      const transcriptData = await info.getTranscript();
      
      if (!transcriptData || !transcriptData.transcript) {
        throw new Error('No transcript available');
      }

      // Convert to our format
      const segments: TranscriptSegment[] = [];
      
      for (const cue of transcriptData.transcript.cues) {
        segments.push({
          timestamp: this.formatTimestamp(cue.start_ms / 1000),
          text: cue.text,
          startTime: cue.start_ms / 1000,
          duration: cue.duration_ms / 1000
        });
      }

      return segments;
    } catch (error) {
      console.error('YouTubei.js transcript fetch failed:', error);
      throw new Error('Failed to fetch transcript using alternative method');
    }
  }

  private formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// Manual transcript extraction as last resort
export async function extractTranscriptManually(videoId: string): Promise<TranscriptSegment[]> {
  try {
    // Fetch the YouTube page
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    
    // Look for caption tracks in the HTML
    const captionRegex = /"captionTracks":(\[.*?\])/;
    const match = html.match(captionRegex);
    
    if (!match) {
      throw new Error('No caption tracks found');
    }
    
    const captionTracks = JSON.parse(match[1]);
    
    // Find English track
    const englishTrack = captionTracks.find((track: any) => 
      track.languageCode === 'en' || 
      track.languageCode === 'en-US' ||
      track.vssId?.includes('.en')
    );
    
    if (!englishTrack || !englishTrack.baseUrl) {
      throw new Error('No English captions found');
    }
    
    // Fetch the caption file
    const captionResponse = await fetch(englishTrack.baseUrl);
    const captionXml = await captionResponse.text();
    
    // Parse XML
    const segments: TranscriptSegment[] = [];
    const textRegex = /<text start="([\d.]+)" dur="([\d.]+)"[^>]*>(.*?)<\/text>/g;
    let textMatch;
    
    while ((textMatch = textRegex.exec(captionXml)) !== null) {
      const start = parseFloat(textMatch[1]);
      const duration = parseFloat(textMatch[2]);
      const text = textMatch[3]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n/g, ' ')
        .trim();
      
      segments.push({
        timestamp: formatTimestamp(start),
        text: text,
        startTime: start,
        duration: duration
      });
    }
    
    return segments;
  } catch (error) {
    console.error('Manual transcript extraction failed:', error);
    throw error;
  }
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}