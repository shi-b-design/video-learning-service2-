'use client';

import { useState } from 'react';
import { EnhancedExplanation } from '@/types/enhanced-explanation';

interface SearchBarProps {
  explanations: EnhancedExplanation[];
  onResultClick: (timestamp: string) => void;
}

export default function SearchBar({ explanations, onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<EnhancedExplanation[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim()) {
      const filtered = explanations.filter(exp => 
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.concepts?.some(concept => 
          concept.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        exp.whatsHappening.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.keyPoint.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultClick = (timestamp: string) => {
    onResultClick(timestamp);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative mb-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search concepts (e.g., 'useState', 'array methods')"
          className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result.timestamp)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{result.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{result.timestamp}</p>
                </div>
                {result.concepts && (
                  <div className="flex gap-1 ml-2">
                    {result.concepts.slice(0, 2).map((concept, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}