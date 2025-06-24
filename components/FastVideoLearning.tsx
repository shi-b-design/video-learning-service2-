'use client';

import { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import EnhancedExplanationPanel from './EnhancedExplanationPanel';
import QuestionInput from './QuestionInput';
import SearchBar from './SearchBar';
import { EnhancedExplanation } from '@/types/enhanced-explanation';
import { parseTimestamp, formatTimestamp } from '@/lib/utils';
import { todoListTranscript } from '@/lib/video-transcripts';

interface FastVideoLearningProps {
  videoId: string;
}

interface QAHistory {
  question: string;
  answer: string;
  timestamp: string;
}

// Pre-generated explanations for instant loading
const preGeneratedExplanations: EnhancedExplanation[] = [
  {
    title: "Welcome & Introduction",
    timestamp: "0:00",
    whyThisMatters: "Understanding what you'll build helps you follow along and see the big picture of React development.",
    whatsHappening: "The instructor introduces the todo list project - a classic beginner app that teaches core React concepts.",
    keyPoint: "Todo lists are perfect for learning React because they involve all fundamental concepts: components, state, and events.",
    concepts: ["react", "introduction", "todo-list"],
    difficulty: "beginner"
  },
  {
    title: "Creating Component Structure",
    timestamp: "0:15",
    whyThisMatters: "Organizing code in components from the start prevents messy, hard-to-maintain applications later.",
    whatsHappening: "A new components folder is created to follow React's convention of separating components into their own files.",
    keyPoint: "Always organize components in a dedicated folder - it's a React best practice that scales well.",
    concepts: ["components", "file-structure", "organization"],
    difficulty: "beginner"
  },
  {
    title: "Component File & Export",
    timestamp: "0:30",
    whyThisMatters: "Without proper exports, your components can't be imported and used in other parts of your application.",
    whatsHappening: "The TodoList.jsx file is created with export default, making it available for import in other files.",
    keyPoint: "Always export your components - forgetting this is a common beginner mistake that causes import errors.",
    concepts: ["export", "modules", "components"],
    difficulty: "beginner"
  }
];

export default function FastVideoLearning({ videoId }: FastVideoLearningProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [explanations, setExplanations] = useState<EnhancedExplanation[]>(preGeneratedExplanations);
  const [activeExplanationIndex, setActiveExplanationIndex] = useState<number | null>(null);
  const [qaHistory, setQaHistory] = useState<QAHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const lastGeneratedTime = useRef(0);
  const generatingForTime = useRef<number | null>(null);

  // Generate explanation for current time if needed
  useEffect(() => {
    const currentInterval = Math.floor(currentTime / 15) * 15;
    
    // Check if we need to generate an explanation for this interval
    const hasExplanation = explanations.some(exp => 
      parseTimestamp(exp.timestamp) === currentInterval
    );

    // Only generate if we don't have it and we're not already generating
    if (!hasExplanation && currentInterval !== generatingForTime.current && currentTime > 0) {
      generateExplanationForTime(currentInterval);
    }
  }, [currentTime, explanations]);

  // Find active explanation
  useEffect(() => {
    let activeIndex: number | null = null;
    
    for (let i = 0; i < explanations.length; i++) {
      const explanationTime = parseTimestamp(explanations[i].timestamp);
      const nextExplanationTime = i < explanations.length - 1 
        ? parseTimestamp(explanations[i + 1].timestamp) 
        : Infinity;
      
      if (currentTime >= explanationTime && currentTime < nextExplanationTime) {
        activeIndex = i;
        break;
      }
    }
    
    setActiveExplanationIndex(activeIndex);
  }, [currentTime, explanations]);

  const generateExplanationForTime = async (seconds: number) => {
    if (generatingForTime.current === seconds) return;
    
    generatingForTime.current = seconds;
    setIsGenerating(true);

    try {
      // Find transcript around this time
      const relevantTranscript = todoListTranscript
        .filter(t => {
          const tSeconds = parseTimestamp(t.timestamp);
          return tSeconds >= seconds && tSeconds < seconds + 15;
        })
        .map(t => t.text)
        .join(' ');

      // Generate using AI
      const response = await fetch('/api/generate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: formatTimestamp(seconds),
          transcript: relevantTranscript || 'Continuing from previous section...',
          previousContext: explanations.slice(-2).map(e => e.title).join(', ')
        })
      });

      if (response.ok) {
        const newExplanation = await response.json();
        setExplanations(prev => [...prev, newExplanation].sort((a, b) => 
          parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp)
        ));
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
    } finally {
      setIsGenerating(false);
      generatingForTime.current = null;
    }
  };

  const handleTimeUpdate = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handleQuestionAnswered = (question: string, answer: string) => {
    setQaHistory(prev => [...prev, {
      question,
      answer,
      timestamp: formatTimestamp(currentTime)
    }]);
  };

  const handleSearchResultClick = (timestamp: string) => {
    // TODO: Implement video seek
    console.log('Seeking to:', timestamp);
  };

  const currentExplanation = activeExplanationIndex !== null 
    ? explanations[activeExplanationIndex] 
    : null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Video Section - 2/3 width */}
      <div className="w-2/3 p-6">
        <div className="h-full flex flex-col">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Video Code Review Service
            </h1>
            <p className="text-lg text-gray-600">
              Real-time AI explanations as you watch
            </p>
          </div>
          
          <div className="flex-1 relative">
            <VideoPlayer videoId={videoId} onTimeUpdate={handleTimeUpdate} />
            
            {/* Generation indicator */}
            {isGenerating && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                Generating explanation...
              </div>
            )}
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Current time: {formatTimestamp(currentTime)} / 20:00
          </div>
        </div>
      </div>

      {/* Explanations Section - 1/3 width */}
      <div className="w-1/3 bg-white shadow-lg overflow-hidden flex flex-col">
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Live Explanations
          </h2>
          
          <SearchBar 
            explanations={explanations}
            onResultClick={handleSearchResultClick}
          />
          
          <QuestionInput
            currentTimestamp={formatTimestamp(currentTime)}
            onQuestionAnswered={handleQuestionAnswered}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Timeline Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round((currentTime / 1200) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / 1200) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Explanation */}
          {currentExplanation ? (
            <EnhancedExplanationPanel
              explanation={currentExplanation}
              isActive={true}
              relatedExplanations={explanations}
              onRelatedClick={handleSearchResultClick}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg mb-2">Ready to explain</p>
              <p className="text-sm">Play the video to see AI-powered explanations</p>
            </div>
          )}

          {/* Recent Explanations */}
          {explanations.length > 3 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Topics</h3>
              <div className="space-y-2">
                {explanations.slice(-3).reverse().map((exp, index) => (
                  <div 
                    key={index} 
                    className="text-xs p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSearchResultClick(exp.timestamp)}
                  >
                    <span className="font-medium">{exp.timestamp}</span> - {exp.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Q&A History */}
          {qaHistory.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Questions</h3>
              <div className="space-y-3">
                {qaHistory.slice(-3).map((qa, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-medium text-gray-900">Q: {qa.question}</p>
                      <span className="text-xs text-gray-500">{qa.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">A: {qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}