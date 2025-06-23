'use client';

import { EnhancedExplanation } from '@/types/enhanced-explanation';
import { Highlight, themes } from 'prism-react-renderer';

interface EnhancedExplanationPanelProps {
  explanation: EnhancedExplanation;
  isActive: boolean;
  relatedExplanations?: EnhancedExplanation[];
  onRelatedClick?: (timestamp: string) => void;
}

export default function EnhancedExplanationPanel({ 
  explanation, 
  isActive,
  relatedExplanations,
  onRelatedClick
}: EnhancedExplanationPanelProps) {
  if (!isActive) return null;

  return (
    <div className="bg-white rounded-lg p-4 animate-fadeIn">
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900">{explanation.title}</h3>
          {explanation.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              explanation.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              explanation.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {explanation.difficulty}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {explanation.timestamp}
        </span>
      </div>

      <div className="space-y-3">
        {/* Why This Matters */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
          <h4 className="font-semibold text-blue-900 mb-1 text-xs uppercase tracking-wide">
            Why This Matters
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {explanation.whyThisMatters}
          </p>
        </div>

        {/* What's Happening */}
        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
          <h4 className="font-semibold text-green-900 mb-1 text-xs uppercase tracking-wide">
            What's Happening
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {explanation.whatsHappening}
          </p>
        </div>

        {/* Key Point */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
          <h4 className="font-semibold text-amber-900 mb-1 text-xs uppercase tracking-wide">
            Key Point
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {explanation.keyPoint}
          </p>
        </div>

        {/* Code Changes */}
        {explanation.codeChange && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wide">
              Code Change
            </h4>
            <div className="space-y-2">
              {explanation.codeChange.before && (
                <div className="text-xs">
                  <span className="text-red-600 font-mono">- {explanation.codeChange.before}</span>
                </div>
              )}
              {explanation.codeChange.after && (
                <div className="text-xs">
                  <span className="text-green-600 font-mono">+ {explanation.codeChange.after}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Concepts */}
        {explanation.concepts && explanation.concepts.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {explanation.concepts.map((concept, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {concept}
              </span>
            ))}
          </div>
        )}

        {/* Related Explanations */}
        {explanation.relatedTo && explanation.relatedTo.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Related to:</h4>
            <div className="space-y-1">
              {relatedExplanations?.filter(rel => 
                explanation.relatedTo?.includes(rel.timestamp)
              ).map((related, index) => (
                <button
                  key={index}
                  onClick={() => onRelatedClick?.(related.timestamp)}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-left"
                >
                  {related.timestamp} - {related.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Code Examples */}
      {explanation.codeExample && (
        <div className="mt-4 space-y-3">
          <h4 className="font-semibold text-sm text-gray-900">Code Example</h4>
          
          {explanation.codeExample.correct && (
            <div>
              <h5 className="font-medium text-green-600 text-xs mb-1 flex items-center">
                <span className="text-sm mr-1">✓</span> Correct
              </h5>
              <Highlight
                theme={themes.github}
                code={explanation.codeExample.correct}
                language={explanation.codeExample.language as any}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-2 rounded-lg overflow-x-auto text-xs`} style={style}>
                    <code>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </code>
                  </pre>
                )}
              </Highlight>
            </div>
          )}
          
          {explanation.codeExample.incorrect && (
            <div>
              <h5 className="font-medium text-red-600 text-xs mb-1 flex items-center">
                <span className="text-sm mr-1">✗</span> Avoid
              </h5>
              <Highlight
                theme={themes.github}
                code={explanation.codeExample.incorrect}
                language={explanation.codeExample.language as any}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-2 rounded-lg overflow-x-auto text-xs`} style={style}>
                    <code>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </code>
                  </pre>
                )}
              </Highlight>
            </div>
          )}
        </div>
      )}
    </div>
  );
}