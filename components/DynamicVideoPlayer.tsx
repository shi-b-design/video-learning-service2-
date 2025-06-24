'use client';

import { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import EnhancedExplanationPanel from './EnhancedExplanationPanel';
import QuestionInput from './QuestionInput';
import SearchBar from './SearchBar';
import VideoSuggestions from './VideoSuggestions';
import { EnhancedExplanation, TranscriptSegment } from '@/types/enhanced-explanation';
import { parseTimestamp, formatTimestamp } from '@/lib/utils';

interface DynamicVideoPlayerProps {
  initialVideoUrl?: string;
}

interface VideoData {
  videoId: string;
  metadata: {
    title: string;
    description: string;
    duration: string;
    channel: string;
  };
  transcript: TranscriptSegment[];
}

interface QAHistory {
  question: string;
  answer: string;
  timestamp: string;
}

export default function DynamicVideoPlayer({ initialVideoUrl }: DynamicVideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl || '');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [explanations, setExplanations] = useState<EnhancedExplanation[]>([]);
  const [activeExplanationIndex, setActiveExplanationIndex] = useState<number | null>(null);
  const [qaHistory, setQaHistory] = useState<QAHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const generatingForTime = useRef<number | null>(null);

  // Fetch transcript when URL changes
  const handleLoadVideo = async () => {
    if (!videoUrl.trim()) return;

    setLoading(true);
    setError(null);
    setVideoData(null);
    setExplanations([]);
    setQaHistory([]);

    try {
      const response = await fetch('/api/fetch-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });

      const data = await response.json();

      if (!response.ok && !data.metadata) {
        throw new Error(data.error || 'Failed to load video');
      }

      // Even if transcript failed, we can still show the video
      if (data.metadata) {
        setVideoData(data);
        
        if (data.transcript && data.transcript.length > 0) {
          // Generate initial explanations for key moments
          generateInitialExplanations(data.transcript);
        } else if (data.error) {
          setError(data.error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  // Generate explanations for the first few key moments
  const generateInitialExplanations = async (transcript: TranscriptSegment[]) => {
    if (!transcript || transcript.length === 0) return;

    // Find key moments (every 30 seconds for the first 2 minutes)
    const keyMoments = [0, 30, 60, 90, 120];
    
    for (const seconds of keyMoments) {
      const segment = transcript.find(seg => 
        seg.startTime && Math.abs(seg.startTime - seconds) < 5
      );
      
      if (segment) {
        await generateExplanationForSegment(segment, transcript);
      }
    }
  };

  // Generate explanation for a specific segment
  const generateExplanationForSegment = async (
    segment: TranscriptSegment, 
    allSegments: TranscriptSegment[]
  ) => {
    try {
      // Get context from surrounding segments
      const segmentIndex = allSegments.findIndex(s => s.timestamp === segment.timestamp);
      const contextSegments = allSegments.slice(
        Math.max(0, segmentIndex - 2),
        Math.min(allSegments.length, segmentIndex + 3)
      );
      const contextText = contextSegments.map(s => s.text).join(' ');

      const response = await fetch('/api/generate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: segment.timestamp,
          transcript: segment.text,
          context: contextText
        })
      });

      if (response.ok) {
        const explanation = await response.json();
        setExplanations(prev => {
          const filtered = prev.filter(e => e.timestamp !== explanation.timestamp);
          return [...filtered, explanation].sort((a, b) => 
            parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp)
          );
        });
      }
    } catch (error) {
      console.error('Failed to generate explanation:', error);
    }
  };

  // Generate explanation based on current playback time
  useEffect(() => {
    if (!videoData?.transcript || currentTime === 0) return;

    const currentInterval = Math.floor(currentTime / 30) * 30;
    
    // Check if we need to generate an explanation for this interval
    const hasExplanation = explanations.some(exp => 
      Math.abs(parseTimestamp(exp.timestamp) - currentInterval) < 5
    );

    // Find the closest transcript segment
    const segment = videoData.transcript.find(seg => 
      seg.startTime && Math.abs(seg.startTime - currentInterval) < 5
    );

    if (!hasExplanation && segment && currentInterval !== generatingForTime.current) {
      generatingForTime.current = currentInterval;
      generateExplanationForSegment(segment, videoData.transcript);
    }
  }, [currentTime, videoData, explanations]);

  // Find active explanation
  useEffect(() => {
    if (!explanations.length) {
      setActiveExplanationIndex(null);
      return;
    }

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

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSeek = (timestamp: string) => {
    const seconds = parseTimestamp(timestamp);
    setCurrentTime(seconds);
  };

  const handleQuestionSubmit = async (question: string) => {
    if (!videoData) return;

    const currentTimestamp = formatTimestamp(currentTime);
    const activeExplanation = activeExplanationIndex !== null 
      ? explanations[activeExplanationIndex] 
      : undefined;

    // Find recent transcript context
    const recentTranscript = videoData.transcript
      .filter(seg => seg.startTime && seg.startTime <= currentTime && seg.startTime > currentTime - 30)
      .map(seg => seg.text)
      .join(' ');

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          currentTimestamp,
          videoContext: {
            recentTranscript,
            currentExplanation: activeExplanation
          }
        })
      });

      if (response.ok) {
        const { answer } = await response.json();
        setQaHistory(prev => [{
          question,
          answer,
          timestamp: currentTimestamp
        }, ...prev]);
      }
    } catch (error) {
      console.error('Failed to get answer:', error);
    }
  };

  const handleSearch = (query: string) => {
    if (!explanations.length) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return explanations.filter(exp => 
      exp.title.toLowerCase().includes(lowercaseQuery) ||
      exp.whyThisMatters.toLowerCase().includes(lowercaseQuery) ||
      exp.whatsHappening.toLowerCase().includes(lowercaseQuery) ||
      exp.concepts.some(concept => concept.toLowerCase().includes(lowercaseQuery))
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Video URL Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLoadVideo()}
            placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLoadVideo}
            disabled={loading || !videoUrl.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load Video'}
          </button>
        </div>
        
        {error && (
          <div className="mt-2">
            <p className="text-red-600 text-sm">{error}</p>
            <VideoSuggestions onSelectVideo={(url) => {
              setVideoUrl(url);
              handleLoadVideo();
            }} />
          </div>
        )}
        
        {!videoData && !loading && !error && (
          <VideoSuggestions onSelectVideo={(url) => {
            setVideoUrl(url);
            handleLoadVideo();
          }} />
        )}
      </div>

      {/* Main Content */}
      {videoData && (
        <>
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{videoData.metadata.title}</h1>
            <p className="text-gray-600">
              {videoData.metadata.channel} • {videoData.metadata.duration}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <VideoPlayer 
                videoId={videoData.videoId}
                onTimeUpdate={handleTimeUpdate}
                currentTime={currentTime}
              />
              
              <SearchBar 
                onSearch={handleSearch}
                onResultClick={handleSeek}
              />
              
              <QuestionInput 
                onSubmit={handleQuestionSubmit}
                disabled={!videoData}
              />
              
              {qaHistory.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Your Questions</h3>
                  <div className="space-y-3">
                    {qaHistory.map((qa, index) => (
                      <div key={index} className="bg-white rounded p-3 shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-sm">{qa.question}</p>
                          <span className="text-xs text-gray-500">{qa.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <EnhancedExplanationPanel 
                explanations={explanations}
                activeIndex={activeExplanationIndex}
                onTimestampClick={handleSeek}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Transcript for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8">
              <summary className="cursor-pointer text-sm text-gray-600">
                Debug: View Transcript ({videoData.transcript.length} segments)
              </summary>
              <div className="mt-2 text-xs bg-gray-100 p-4 rounded max-h-48 overflow-y-auto">
                {videoData.transcript.map((seg, i) => (
                  <div key={i} className="mb-1">
                    <span className="font-mono">{seg.timestamp}</span>: {seg.text}
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}