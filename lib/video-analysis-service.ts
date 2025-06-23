import { EnhancedExplanation, TranscriptSegment } from '@/types/enhanced-explanation';

export interface VideoMetadata {
  videoId: string;
  title: string;
  duration: number; // in seconds
  transcript: TranscriptSegment[];
}

export class VideoAnalysisService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  /**
   * Fetches video transcript (mock implementation - would use YouTube API in production)
   */
  async fetchVideoTranscript(videoId: string): Promise<TranscriptSegment[]> {
    console.log('Fetching transcript for video:', videoId);
    
    // Import the actual transcript for the todo list video
    if (videoId === '9wiWzu_tRB0') {
      const { todoListTranscript } = await import('./video-transcripts');
      return todoListTranscript;
    }
    
    // Fallback for other videos
    return [
      { timestamp: "0:00", text: "Video transcript would be fetched here via YouTube API." },
      { timestamp: "0:15", text: "For now, using placeholder content." }
    ];
  }

  /**
   * Analyzes video transcript and generates explanations using AI
   */
  async generateExplanations(
    transcript: TranscriptSegment[],
    intervalSeconds: number = 15
  ): Promise<EnhancedExplanation[]> {
    if (!this.apiKey) {
      console.warn('No OpenAI API key found. Using fallback generation.');
      return this.generateFallbackExplanations(transcript, intervalSeconds);
    }

    const explanations: EnhancedExplanation[] = [];
    
    // Group transcript by time intervals
    const timeGroups = this.groupTranscriptByInterval(transcript, intervalSeconds);
    
    // Generate explanation for each interval
    for (const [timestamp, segments] of timeGroups) {
      const explanation = await this.generateExplanationForSegment(
        timestamp,
        segments,
        explanations
      );
      explanations.push(explanation);
    }

    return explanations;
  }

  /**
   * Groups transcript segments by time interval
   */
  private groupTranscriptByInterval(
    transcript: TranscriptSegment[],
    intervalSeconds: number
  ): Map<string, TranscriptSegment[]> {
    const groups = new Map<string, TranscriptSegment[]>();
    
    // Find the maximum timestamp to ensure we cover the entire video
    let maxSeconds = 0;
    transcript.forEach(segment => {
      const seconds = this.parseTimestamp(segment.timestamp);
      maxSeconds = Math.max(maxSeconds, seconds);
    });
    
    // Create groups for every interval up to the maximum timestamp
    for (let i = 0; i <= Math.ceil(maxSeconds / intervalSeconds); i++) {
      const intervalTimestamp = this.formatTimestamp(i * intervalSeconds);
      groups.set(intervalTimestamp, []);
    }
    
    // Assign segments to their corresponding intervals
    transcript.forEach(segment => {
      const seconds = this.parseTimestamp(segment.timestamp);
      const intervalIndex = Math.floor(seconds / intervalSeconds);
      const intervalTimestamp = this.formatTimestamp(intervalIndex * intervalSeconds);
      
      if (groups.has(intervalTimestamp)) {
        groups.get(intervalTimestamp)!.push(segment);
      }
    });

    return groups;
  }

  /**
   * Generates explanation for a group of transcript segments using AI
   */
  private async generateExplanationForSegment(
    timestamp: string,
    segments: TranscriptSegment[],
    previousExplanations: EnhancedExplanation[]
  ): Promise<EnhancedExplanation> {
    const transcriptText = segments.map(s => s.text).join(' ').trim();
    
    // If no transcript for this segment, use context from previous segments
    if (!transcriptText && segments.length === 0) {
      const contextText = previousExplanations.length > 0 
        ? `Continuing from: ${previousExplanations[previousExplanations.length - 1].title}`
        : 'Video segment without narration';
      return this.generateFallbackExplanation(timestamp, contextText);
    }
    
    if (!this.apiKey) {
      return this.generateFallbackExplanation(timestamp, transcriptText || 'No transcript available');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert programming instructor analyzing a React todo list tutorial video. 
              Explain what's happening at each timestamp to help beginners understand the decisions being made.
              Focus on WHY the developer makes each choice, not just what they're doing.
              Be concise but insightful.`
            },
            {
              role: 'user',
              content: `At timestamp ${timestamp}, the transcript says: "${transcriptText}"
              
              ${previousExplanations.length > 0 ? `Previous topics covered: ${previousExplanations.slice(-2).map(e => e.title).join(', ')}` : ''}
              
              Provide a JSON response with:
              {
                "title": "Brief title (max 5 words)",
                "whyThisMatters": "Why this coding decision matters for beginners (1-2 sentences)",
                "whatsHappening": "Technical explanation of what's happening (1-2 sentences)",
                "keyPoint": "The single most important thing to remember (1 sentence)",
                "concepts": ["array", "of", "2-4", "concepts"],
                "difficulty": "beginner|intermediate|advanced"
              }`
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status, response.statusText);
        return this.generateFallbackExplanation(timestamp, transcriptText);
      }

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);

      return {
        title: content.title || 'Code Explanation',
        timestamp,
        whyThisMatters: content.whyThisMatters,
        whatsHappening: content.whatsHappening,
        keyPoint: content.keyPoint,
        concepts: content.concepts || [],
        difficulty: content.difficulty || 'beginner'
      };
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return this.generateFallbackExplanation(timestamp, transcriptText);
    }
  }

  private generateFallbackExplanation(timestamp: string, text: string): EnhancedExplanation {
    return {
      title: `Moment at ${timestamp}`,
      timestamp,
      whyThisMatters: `This section covers: "${text.substring(0, 50)}..."`,
      whatsHappening: "Unable to generate AI explanation. Check your OpenAI API key.",
      keyPoint: "AI explanations require a valid OpenAI API key.",
      concepts: ["error"],
      difficulty: "beginner"
    };
  }

  /**
   * Fallback explanation generation when no API key
   */
  private generateFallbackExplanations(
    transcript: TranscriptSegment[],
    intervalSeconds: number
  ): EnhancedExplanation[] {
    const explanations: EnhancedExplanation[] = [];
    const timeGroups = this.groupTranscriptByInterval(transcript, intervalSeconds);
    
    let index = 0;
    for (const [timestamp, segments] of timeGroups) {
      const text = segments.map(s => s.text).join(' ');
      
      explanations.push({
        title: `Tutorial Step ${index + 1}`,
        timestamp,
        whyThisMatters: `This section covers: "${text.substring(0, 50)}..."`,
        whatsHappening: "The instructor is explaining a key concept. With AI enabled, this would provide detailed technical analysis.",
        keyPoint: "Enable AI by adding your OpenAI API key to get detailed explanations for this moment.",
        concepts: ["tutorial", `step-${index + 1}`],
        difficulty: "beginner"
      });
      
      index++;
    }

    return explanations;
  }

  /**
   * Analyzes a specific user question about the video
   */
  async answerQuestion(
    question: string,
    timestamp: string,
    context: {
      transcript: TranscriptSegment[];
      nearbyExplanations: EnhancedExplanation[];
    }
  ): Promise<string> {
    if (!this.apiKey) {
      return "To get AI-powered answers, please add your OpenAI API key. For now, here's what I can tell you: The video at this timestamp is covering important coding concepts. Enable AI for detailed, contextual answers.";
    }

    // TODO: Implement actual OpenAI API call
    const prompt = `
    User question: ${question}
    Current timestamp: ${timestamp}
    Recent transcript: ${context.transcript.slice(-5).map(s => s.text).join(' ')}
    
    Provide a helpful, beginner-friendly answer.
    `;

    return "AI-powered answer would appear here based on the video context...";
  }

  private parseTimestamp(timestamp: string): number {
    const parts = timestamp.split(':').map(Number);
    return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
  }

  private formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Singleton instance
export const videoAnalysisService = new VideoAnalysisService();