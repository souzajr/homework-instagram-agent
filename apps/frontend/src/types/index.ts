export enum ContentType {
  POST = 'POST',
  STORY = 'STORY'
}

export enum SelectedOption {
  A = 'A',
  B = 'B'
}

export interface ContentOption {
  caption: string;
  hashtags: string[];
}

export interface Generation {
  id: string;
  prompt: string;
  type: ContentType;
  optionA: ContentOption;
  optionB: ContentOption;
  selectedOption: SelectedOption | null;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response types
export interface GenerateContentRequest {
  prompt: string;
  type: ContentType;
}

export interface GenerateContentResponse {
  id: string;
  prompt: string;
  type: ContentType;
  optionA: ContentOption;
  optionB: ContentOption;
}

export interface SelectOptionRequest {
  generationId: string;
  selectedOption: SelectedOption;
}

export interface SelectOptionResponse {
  success: boolean;
  generation: Generation;
}

export interface GetHistoryResponse {
  generations: Generation[];
  total: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}

// Error types
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Analytics types
export interface AnalyticsData {
  totalGenerations: number;
  optionASelected: number;
  optionBSelected: number;
  mostPopularPrompts: Array<{
    prompt: string;
    count: number;
  }>;
  contentTypeBreakdown: {
    POST: number;
    STORY: number;
  };
}