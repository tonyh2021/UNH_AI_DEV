import {GEMINI_API_KEY} from '@env';
import axios from 'axios';
import {AIMessageResponseType, AIMessageType, GeminiModel} from '../type';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1/models';

interface Part {
  text?: string;
  inline_data?: {
    mime_type: string; // MIME of image
    data: string; // Base64 of image
  };
}

export const requestGemini = async (params: {
  model?: GeminiModel;
  messages: AIMessageType[];
}): Promise<AIMessageResponseType> => {
  const {model = GeminiModel.GEMINI_15_FLASH_8B, messages} = params;

  const contents = [] as {
    role: string;
    parts: Part[];
  }[];
  messages.map(message => {
    const parts = [] as Part[];
    if (message.imageType && message.base64) {
      parts.push({
        text: 'Caption this image.',
      });
      parts.push({
        inline_data: {
          mime_type: message.imageType,
          data: message.base64,
        },
      });
    } else {
      parts.push({text: message.text});
    }
    contents.push({role: message.role, parts});
  });

  const url = `${BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const response = await axios.post(
      url,
      {
        contents,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0]
    ) {
      return {
        data: {
          role: 'model',
          text: response.data.candidates[0].content.parts[0].text,
        },
      };
    } else {
      throw new Error('Invalid response structure from Gemini API');
    }
  } catch (error) {
    throw error;
  }
};
