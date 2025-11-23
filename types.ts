export interface CompanyAnalysis {
  name: string;
  description: string;
  industry: string;
  targetAudience: string[];
  keySellingPoints: string[];
  brandTone: string;
  products: Array<{
    name: string;
    description: string;
  }>;
  generatedSystemInstruction: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
