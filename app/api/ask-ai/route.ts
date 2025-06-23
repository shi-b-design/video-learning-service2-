import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question, timestamp } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        answer: "Please add your OpenAI API key to the .env file to enable AI responses."
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
            content: 'You are a helpful programming instructor answering questions about a React todo list tutorial. Be concise, friendly, and focus on explaining the "why" behind coding decisions. Keep answers under 150 words.'
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
      return NextResponse.json({
        answer: "Sorry, I couldn't process your question. Please try again."
      });
    }

    const data = await response.json();
    return NextResponse.json({
      answer: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in ask-ai route:', error);
    return NextResponse.json({
      answer: "Sorry, there was an error processing your question."
    }, { status: 500 });
  }
}