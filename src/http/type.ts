import {IMessage} from 'react-native-gifted-chat';

export enum AIPlatformType {
  OpenAI = 'openai',
  Gemini = 'gemini',
}

export enum OpenAIModel {
  GPT_4_MINI = 'gpt-4o-mini',
  GPT_35_TURBO = 'gpt-3.5-turbo',
}

export enum GeminiModel {
  GEMINI_PRO = 'gemini-pro', // not support image
  GEMINI_15_FLASH = 'gemini-1.5-flash',
  GEMINI_15_FLASH_8B = 'gemini-1.5-flash-8b',
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
