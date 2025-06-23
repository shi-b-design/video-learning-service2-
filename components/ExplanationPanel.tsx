'use client';

import { Explanation } from '@/types/explanation';
import { Highlight, themes } from 'prism-react-renderer';

interface ExplanationPanelProps {
  explanation: Explanation;
  isActive: boolean;
}

export default function ExplanationPanel({ explanation, isActive }: ExplanationPanelProps) {
  if (!isActive) return null;

  return (
    <div className="bg-white rounded-lg p-4 animate-fadeIn">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{explanation.title}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {explanation.timestamp}
        </span>
      </div>

      <div className="space-y-4">
        {/* Why This Matters */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <h4 className="font-semibold text-blue-900 mb-2 text-sm uppercase tracking-wide">
            Why This Matters
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {explanation.whyThisMatters}
          </p>
        </div>

        {/* What's Happening */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <h4 className="font-semibold text-green-900 mb-2 text-sm uppercase tracking-wide">
            What's Happening
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {explanation.whatsHappening}
          </p>
        </div>

        {/* Key Point */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <h4 className="font-semibold text-amber-900 mb-2 text-sm uppercase tracking-wide">
            Key Point
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {explanation.keyPoint}
          </p>
        </div>
      </div>

      {/* Code Examples */}
      {explanation.codeExample && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-base text-gray-900">Code Example</h4>
          
          {explanation.codeExample.correct && (
            <div>
              <h5 className="font-medium text-green-600 text-sm mb-2 flex items-center">
                <span className="text-lg mr-1">✓</span> Correct Approach
              </h5>
              <Highlight
                theme={themes.github}
                code={explanation.codeExample.correct}
                language={explanation.codeExample.language as any}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-3 rounded-lg overflow-x-auto text-xs`} style={style}>
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
              <h5 className="font-medium text-red-600 text-sm mb-2 flex items-center">
                <span className="text-lg mr-1">✗</span> Common Mistake
              </h5>
              <Highlight
                theme={themes.github}
                code={explanation.codeExample.incorrect}
                language={explanation.codeExample.language as any}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-3 rounded-lg overflow-x-auto text-xs`} style={style}>
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