import {IMessage} from 'react-native-gifted-chat';

export enum AIPlatformType {
  OpenAI = 'openai',
  Gemini = 'gemini',
}

export enum OpenAIModel {
  GPT_4_O = 'gpt-4o',
  GPT_4_MINI = 'gpt-4o-mini',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_35_TURBO = 'gpt-3.5-turbo',
}

export enum GeminiModel {
  GEMINI_15_FLASH = 'gemini-1.5-flash',
  GEMINI_15_FLASH_8B = 'gemini-1.5-flash-8b',
  GEMINI_15_PRO = 'gemini-1.5-pro',
}

export interface UIMessage extends IMessage {
  imageType?: string;
  base64?: string;
}

export interface AIMessageType {
  role: string;
  text: string;
  imageType?: string;
  base64?: string;
}

export interface AIMessageResponseType {
  data: AIMessageType;
}
