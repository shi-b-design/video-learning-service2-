import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { timestamp, transcript, previousContext } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        title: `Moment at ${timestamp}`,
        timestamp,
        whyThisMatters: "AI explanations require an OpenAI API key.",
        whatsHappening: transcript.substring(0, 100) + "...",
        keyPoint: "Add your OpenAI API key to get detailed explanations.",
        concepts: ["tutorial"],
        difficulty: "beginner"
      });
    }

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
            content: `You are an expert programming instructor analyzing a React todo list tutorial video. 
            Explain what's happening at each timestamp to help beginners understand the decisions being made.
            Focus on WHY the developer makes each choice, not just what they're doing.
            Be concise but insightful.`
          },
          {
            role: 'user',
            content: `At timestamp ${timestamp}, the transcript says: "${transcript}"
            
            ${previousContext ? `Previous topics: ${previousContext}` : ''}
            
            Provide a JSON response with:
            {
              "title": "Brief title (max 5 words)",
              "whyThisMatters": "Why this matters for beginners (1-2 sentences)",
              "whatsHappening": "Technical explanation (1-2 sentences)",
              "keyPoint": "The key thing to remember (1 sentence)",
              "concepts": ["2-4", "relevant", "concepts"],
              "difficulty": "beginner|intermediate|advanced"
            }`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      title: content.title,
      timestamp,
      whyThisMatters: content.whyThisMatters,
      whatsHappening: content.whatsHappening,
      keyPoint: content.keyPoint,
      concepts: content.concepts || [],
      difficulty: content.difficulty || 'beginner'
    });
  } catch (error) {
    console.error('Error generating explanation:', error);
    return NextResponse.json({
      title: `Error at ${timestamp}`,
      timestamp,
      whyThisMatters: "Unable to generate explanation.",
      whatsHappening: "An error occurred while processing this segment.",
      keyPoint: "Please try again or check your API key.",
      concepts: ["error"],
      difficulty: "beginner"
    }, { status: 500 });
  }
}