/**
 * OpenAI Integration for Video Analysis
 * 
 * To enable AI-powered explanations:
 * 1. Get an API key from https://platform.openai.com/api-keys
 * 2. Create a .env file in the root directory
 * 3. Add: OPENAI_API_KEY=your_api_key_here
 * 4. Restart the development server
 */

import { EnhancedExplanation, TranscriptSegment } from '@/types/enhanced-explanation';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generates explanation for a video segment
   */
  async generateExplanation(
    timestamp: string,
    transcript: string,
    previousContext: string = ''
  ): Promise<EnhancedExplanation> {
    const systemPrompt = `You are an expert programming instructor analyzing coding tutorial videos. 
    Your job is to explain what's happening at each moment to help beginners understand not just WHAT the code does, but WHY the developer made each decision.
    
    Format your response as JSON with these fields:
    - title: Brief, clear title for this moment (max 6 words)
    - whyThisMatters: Explain why this decision/code matters for beginners (1-2 sentences)
    - whatsHappening: Technical explanation of what's happening (1-2 sentences)
    - keyPoint: The single most important thing to remember (1 sentence)
    - concepts: Array of 2-4 searchable concept tags
    - difficulty: "beginner", "intermediate", or "advanced"
    - relatedTo: Array of previous timestamps this relates to (if any)`;

    const userPrompt = `
    Timestamp: ${timestamp}
    Transcript: "${transcript}"
    Previous context: ${previousContext}
    
    Analyze this moment and provide a beginner-friendly explanation.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = JSON.parse(data.choices[0].message.content);

      return {
        timestamp,
        title: content.title || 'Code Explanation',
        whyThisMatters: content.whyThisMatters || 'Understanding this concept is important.',
        whatsHappening: content.whatsHappening || 'The developer is implementing a solution.',
        keyPoint: content.keyPoint || 'Pay attention to the implementation details.',
        concepts: content.concepts || ['programming'],
        difficulty: content.difficulty || 'beginner',
        relatedTo: content.relatedTo
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  /**
   * Answers a user question about the video
   */
  async answerQuestion(
    question: string,
    currentTimestamp: string,
    videoContext: {
      recentTranscript: string;
      currentExplanation?: EnhancedExplanation;
    }
  ): Promise<string> {
    const systemPrompt = `You are a helpful programming instructor. Answer questions about the coding tutorial video in a beginner-friendly way.
    Keep answers concise but informative. Use examples when helpful.`;

    const userPrompt = `
    Question: ${question}
    Current timestamp: ${currentTimestamp}
    What's happening: ${videoContext.currentExplanation?.whatsHappening || 'General coding tutorial'}
    Recent transcript: "${videoContext.recentTranscript}"
    
    Provide a clear, helpful answer.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }
}

// Example usage:
export function createOpenAIService(): OpenAIService | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('No OpenAI API key found. AI features will be disabled.');
    return null;
  }
  return new OpenAIService(apiKey);
}