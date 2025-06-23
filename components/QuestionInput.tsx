'use client';

import { useState } from 'react';
// Remove direct import - we'll use API route instead

interface QuestionInputProps {
  currentTimestamp: string;
  onQuestionAnswered: (question: string, answer: string) => void;
}

export default function QuestionInput({ currentTimestamp, onQuestionAnswered }: QuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, timestamp: currentTimestamp })
      });
      
      const data = await response.json();
      onQuestionAnswered(question, data.answer);
      setQuestion('');
    } catch (error) {
      console.error('Error getting AI response:', error);
      onQuestionAnswered(question, 'Sorry, there was an error processing your question.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about this moment... (e.g., 'Why use map instead of forEach?')"
          className="w-full px-4 py-3 pr-24 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ...
            </span>
          ) : (
            'Ask AI'
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Ask questions about the code at {currentTimestamp}
      </p>
    </form>
  );
}