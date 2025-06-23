export interface EnhancedExplanation extends Explanation {
  relatedTo?: string[]; // References to other timestamps
  codeChange?: {
    before: string;
    after: string;
    lineNumbers?: number[];
  };
  concepts?: string[]; // Searchable concepts
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface VideoAnalysis {
  transcript: TranscriptSegment[];
  codeSnapshots: CodeSnapshot[];
  explanations: EnhancedExplanation[];
}

export interface TranscriptSegment {
  timestamp: string;
  text: string;
  speaker?: string;
}

export interface CodeSnapshot {
  timestamp: string;
  code: string;
  language: string;
  changes?: CodeChange[];
}

export interface CodeChange {
  type: 'addition' | 'deletion' | 'modification';
  lineNumber: number;
  content: string;
}

export interface UserQuestion {
  id: string;
  timestamp: string;
  question: string;
  answer?: string;
  relatedExplanations?: string[]; // Timestamps
}

export interface Explanation {
  title: string;
  timestamp: string;
  whyThisMatters: string;
  whatsHappening: string;
  keyPoint: string;
  codeExample?: {
    correct: string;
    incorrect?: string;
    language: string;
  };
}