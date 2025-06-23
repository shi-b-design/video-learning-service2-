'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import ExplanationPanel from './ExplanationPanel';
import { Explanation } from '@/types/explanation';
import { parseTimestamp } from '@/lib/utils';

interface VideoLearningInterfaceProps {
  videoId: string;
  explanations: Explanation[];
}

export default function VideoLearningInterface({ videoId, explanations }: VideoLearningInterfaceProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeExplanationIndex, setActiveExplanationIndex] = useState<number | null>(null);

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
  }, [currentTime, explanations]);

  const handleTimeUpdate = (seconds: number) => {
    setCurrentTime(seconds);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Video Section - 2/3 width */}
      <div className="w-2/3 p-6">
        <div className="h-full flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Video Code Review Service
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Understanding the "why" behind code decisions in tutorial videos
          </p>
          <div className="flex-1">
            <VideoPlayer videoId={videoId} onTimeUpdate={handleTimeUpdate} />
          </div>
        </div>
      </div>

      {/* Explanations Section - 1/3 width */}
      <div className="w-1/3 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Decision Points
          </h2>
          
          {/* Timeline indicators */}
          <div className="mb-6">
            {explanations.map((explanation, index) => {
              const isActive = activeExplanationIndex === index;
              const isPast = activeExplanationIndex !== null && index < activeExplanationIndex;
              
              return (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-blue-500 bg-blue-50'
                      : isPast
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-blue-700' : isPast ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {explanation.timestamp}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : isPast
                        ? 'bg-gray-400 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isActive ? 'Now' : isPast ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className={`text-sm mt-1 ${
                    isActive ? 'text-blue-900 font-semibold' : 'text-gray-700'
                  }`}>
                    {explanation.title}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Active Explanation */}
          <div className="border-t pt-6">
            {activeExplanationIndex !== null ? (
              <ExplanationPanel
                explanation={explanations[activeExplanationIndex]}
                isActive={true}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg mb-2">No active explanation</p>
                <p className="text-sm">Play the video to see explanations at key decision points</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}