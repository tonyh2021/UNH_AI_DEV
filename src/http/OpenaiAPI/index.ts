import {OPENAI_API_KEY} from '@env';
import axios from 'axios';
import {AIMessageResponseType, AIMessageType, OpenAIModel} from '../type';

const BASE_URL = 'https://api.openai.com/v1/chat/completions';

export const requestOpenai = async (params: {
  model?: OpenAIModel;
  messages: AIMessageType[];
}): Promise<AIMessageResponseType> => {
  const {model = OpenAIModel.GPT3_4_MINI, messages} = params;

  const contents = [] as {
    role: string;
    content: {type: string; text: string}[];
  }[];
  messages.map((message, index) => {
    const content = [];
    if (index === messages.length - 1) {
      content.push({
        type: 'text',
        text:
          message.text + '. Please generate a text of no more than 100 words',
      });
    } else {
      content.push({type: 'text', text: message.text});
    }
    contents.push({role: message.role, content});
  });

  const data = {
    model,
    messages: contents,
    response_format: {
      type: 'text',
    },
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  try {
    const response = await axios.post(`${BASE_URL}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      return {
        data: {
          role: response.data.choices[0].message.role,
          text: response.data.choices[0].message.content,
        },
      };
    } else {
      throw new Error('Invalid response structure from OpenAI API');
    }
  } catch (error) {
    throw error;
  }
};
