'use client';

import { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import EnhancedExplanationPanel from './EnhancedExplanationPanel';
import QuestionInput from './QuestionInput';
import SearchBar from './SearchBar';
import { EnhancedExplanation } from '@/types/enhanced-explanation';
import { parseTimestamp, formatTimestamp } from '@/lib/utils';

interface EnhancedVideoLearningProps {
  videoId: string;
  explanations: EnhancedExplanation[];
}

interface QAHistory {
  question: string;
  answer: string;
  timestamp: string;
}

export default function EnhancedVideoLearning({ videoId, explanations }: EnhancedVideoLearningProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeExplanationIndex, setActiveExplanationIndex] = useState<number | null>(null);
  const [qaHistory, setQaHistory] = useState<QAHistory[]>([]);
  const [showAskButton, setShowAskButton] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the active explanation based on current time
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
    
    // Show ask button periodically
    setShowAskButton(Math.floor(currentTime) % 5 === 0);
  }, [currentTime, explanations]);

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
    // TODO: Implement video seek functionality
    console.log('Seeking to:', timestamp);
  };

  const scrollToExplanation = (index: number) => {
    if (timelineRef.current) {
      const element = timelineRef.current.children[index] as HTMLElement;
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (activeExplanationIndex !== null) {
      scrollToExplanation(activeExplanationIndex);
    }
  }, [activeExplanationIndex]);

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
              AI-powered explanations for every coding decision
            </p>
          </div>
          
          <div className="flex-1 relative">
            <VideoPlayer videoId={videoId} onTimeUpdate={handleTimeUpdate} />
            
            {/* Floating Ask Button */}
            {showAskButton && (
              <button className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105 animate-pulse">
                💭 Ask about this moment
              </button>
            )}
          </div>

          {/* Current timestamp display */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Current time: {formatTimestamp(currentTime)}
          </div>
        </div>
      </div>

      {/* Enhanced Explanations Section - 1/3 width */}
      <div className="w-1/3 bg-white shadow-lg overflow-hidden flex flex-col">
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Live Explanations
          </h2>
          
          {/* Search Bar */}
          <SearchBar 
            explanations={explanations}
            onResultClick={handleSearchResultClick}
          />
          
          {/* Question Input */}
          <QuestionInput
            currentTimestamp={formatTimestamp(currentTime)}
            onQuestionAnswered={handleQuestionAnswered}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Dense Timeline */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h3>
            <div ref={timelineRef} className="space-y-2 max-h-40 overflow-y-auto">
              {explanations.map((explanation, index) => {
                const isActive = activeExplanationIndex === index;
                const isPast = activeExplanationIndex !== null && index < activeExplanationIndex;
                
                return (
                  <div
                    key={index}
                    className={`p-2 rounded-lg border transition-all cursor-pointer text-xs ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : isPast
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isActive ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {explanation.timestamp}
                      </span>
                      {isActive && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">
                          NOW
                        </span>
                      )}
                    </div>
                    <p className={`mt-0.5 ${
                      isActive ? 'text-blue-900 font-medium' : 'text-gray-700'
                    }`}>
                      {explanation.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Explanation */}
          {currentExplanation && (
            <EnhancedExplanationPanel
              explanation={currentExplanation}
              isActive={true}
              relatedExplanations={explanations}
              onRelatedClick={handleSearchResultClick}
            />
          )}

          {/* Q&A History */}
          {qaHistory.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Questions</h3>
              <div className="space-y-3">
                {qaHistory.map((qa, index) => (
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