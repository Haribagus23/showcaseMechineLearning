export type AnalysisResult = {
  fileName: string;
  summary: string;
  keywords: string[];
  sentiment: string;
  word_count?: number;
  error?: string;
};
