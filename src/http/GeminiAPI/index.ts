import {GEMINI_API_KEY} from '@env';
import axios from 'axios';
import {AIMessageResponseType, AIMessageType, GeminiModel} from '../type';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1/models';

export const requestGemini = async (params: {
  model?: GeminiModel;
  messages: AIMessageType[];
}): Promise<AIMessageResponseType> => {
  const {model = GeminiModel.GEMINI_PRO, messages} = params;

  const contents = [] as {role: string; parts: {text: string}[]}[];
  messages.map((message, index) => {
    const parts = [];
    if (index === messages.length - 1) {
      parts.push({
        text: message.text,
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
