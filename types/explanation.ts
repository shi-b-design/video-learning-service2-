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