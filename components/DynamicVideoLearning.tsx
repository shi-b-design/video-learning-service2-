'use client';

import { useState, useEffect } from 'react';
import EnhancedVideoLearning from './EnhancedVideoLearning';
import { EnhancedExplanation } from '@/types/enhanced-explanation';

interface DynamicVideoLearningProps {
  videoId: string;
}

export default function DynamicVideoLearning({ videoId }: DynamicVideoLearningProps) {
  const [explanations, setExplanations] = useState<EnhancedExplanation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAI, setHasAI] = useState(false);

  useEffect(() => {
    const analyzeVideo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/analyze-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            videoId,
            intervalSeconds: 15 // Generate explanation every 15 seconds
          })
        });

        if (!response.ok) {
          throw new Error('Failed to analyze video');
        }

        const data = await response.json();
        setExplanations(data.explanations);
        setHasAI(data.hasAI);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error analyzing video:', err);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeVideo();
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Analyzing video with AI...</p>
          <p className="text-sm text-gray-500 mt-2">Generating explanations for the entire video</p>
          <p className="text-xs text-gray-400 mt-4">This analyzes the complete 9:30 minute video</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Analyzing Video</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!hasAI && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="container mx-auto flex items-center">
            <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-800">
              <strong>Limited Mode:</strong> Add your OpenAI API key to get AI-powered explanations. 
              Currently showing placeholder explanations.
            </p>
          </div>
        </div>
      )}
      <EnhancedVideoLearning 
        videoId={videoId}
        explanations={explanations}
      />
    </>
  );
}