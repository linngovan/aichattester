export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface KnowledgeFile {
  name: string;
  content: string;
  size: number;
  type: string;
}

export interface ChatSessionStats {
  messageCount: number;
  totalTokensApprox: number;
  latencyHistory: { id: number; latency: number }[];
}