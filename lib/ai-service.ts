import { EnhancedExplanation, UserQuestion, CodeSnapshot, TranscriptSegment } from '@/types/enhanced-explanation';

export interface AIServiceConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
}

export interface VideoContext {
  currentTime: number;
  transcript: TranscriptSegment[];
  codeSnapshots: CodeSnapshot[];
  explanations: EnhancedExplanation[];
}

export class AIAnalysisService {
  private config: AIServiceConfig;
  
  constructor(config: AIServiceConfig = {}) {
    this.config = {
      model: 'gpt-4',
      temperature: 0.7,
      ...config
    };
  }

  /**
   * Analyze a specific moment in the video and generate an explanation
   */
  async analyzeMoment(timestamp: string, context: VideoContext): Promise<EnhancedExplanation> {
    // TODO: Implement OpenAI API call
    // For now, return placeholder
    return {
      title: "AI Generated Explanation",
      timestamp,
      whyThisMatters: "AI analysis of why this moment matters...",
      whatsHappening: "AI analysis of what's happening...",
      keyPoint: "AI identified key learning point...",
      concepts: ["ai-generated"],
      difficulty: "beginner"
    };
  }

  /**
   * Answer a user's question about the current moment
   */
  async answerQuestion(question: string, context: VideoContext): Promise<UserQuestion> {
    const currentTimestamp = this.formatTimestamp(context.currentTime);
    
    // TODO: Implement OpenAI API call with context
    // System prompt would include:
    // - Current code visible
    // - Recent transcript
    // - Nearby explanations
    // - Question context
    
    return {
      id: Date.now().toString(),
      timestamp: currentTimestamp,
      question,
      answer: "AI-powered answer will appear here...",
      relatedExplanations: [currentTimestamp]
    };
  }

  /**
   * Search for concepts throughout the video
   */
  async searchConcepts(query: string, context: VideoContext): Promise<EnhancedExplanation[]> {
    // TODO: Implement semantic search using embeddings
    // For now, simple text search
    return context.explanations.filter(exp => 
      exp.concepts?.some(concept => 
        concept.toLowerCase().includes(query.toLowerCase())
      ) ||
      exp.title.toLowerCase().includes(query.toLowerCase()) ||
      exp.whatsHappening.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Generate a summary of code changes between two timestamps
   */
  async summarizeChanges(
    startTime: string, 
    endTime: string, 
    context: VideoContext
  ): Promise<string> {
    // TODO: Implement code diff analysis with AI
    return "Summary of changes between timestamps...";
  }

  /**
   * Detect important moments automatically from transcript
   */
  async detectKeyMoments(context: VideoContext): Promise<string[]> {
    // TODO: Use AI to identify important teaching moments
    // Look for phrases like "this is important", "remember", "the key thing"
    return [];
  }

  private formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Singleton instance
export const aiService = new AIAnalysisService();

// Real AI response function
export async function getMockAIResponse(question: string, timestamp: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return "Please add your OpenAI API key to get AI-powered answers.";
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful programming instructor answering questions about a React todo list tutorial. Be concise, friendly, and focus on explaining the "why" behind coding decisions.'
          },
          {
            role: 'user',
            content: `At timestamp ${timestamp} of the React todo list tutorial, a student asks: "${question}"\n\nProvide a clear, beginner-friendly answer.`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return "Sorry, I couldn't process your question. Please try again.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return "Sorry, there was an error processing your question.";
  }
}