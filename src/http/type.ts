export enum OpenAIModel {
  GPT3_4_MINI = 'gpt-4o-mini',
  GPT3_35_TURBO = 'gpt-3.5-turbo',
}

export enum GeminiModel {
  GEMINI_PRO = 'gemini-pro',
  GEMINI_15_FLASH = 'gemini-1.5-flash',
  GEMINI_15_PRO = 'gemini-1.5-pro',
  GEMINI_10_PRO = 'gemini-1.0-pro',
}

export interface AIMessageType {
  role: string;
  text: string;
}

export interface AIMessageResponseType {
  data: AIMessageType;
}
