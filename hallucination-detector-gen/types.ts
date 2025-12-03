export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface AnalysisResult {
  similarityScore: number;
  contradictionFound: boolean;
  reasoning: string;
  verdict: 'FACTUAL' | 'HALLUCINATION' | 'UNCERTAIN';
}

export interface PythonFile {
  name: string;
  language: string;
  content: string;
}

export interface ConfigParams {
  similarityThreshold: number;
  useVectorSearch: boolean;
  strictRules: boolean;
}