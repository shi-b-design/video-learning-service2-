'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(videoUrl);
    
    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    router.push(`/video/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              AI Video Code Analyzer
            </h1>
            <p className="text-xl text-gray-600">
              Understand every coding decision with AI-powered explanations
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Paste any coding tutorial video URL from YouTube
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Video'
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How it works:
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">1.</span>
                  Paste any YouTube coding tutorial URL
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">2.</span>
                  AI analyzes the video transcript every 15 seconds
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">3.</span>
                  Get explanations for every coding decision
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">4.</span>
                  Ask questions about any moment in the video
                </li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> For full AI capabilities, add your OpenAI API key to the .env file. 
                Without it, you'll see placeholder explanations.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Try with this example: 
              <button
                onClick={() => setVideoUrl('https://www.youtube.com/watch?v=9wiWzu_tRB0')}
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                React Todo List Tutorial
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}