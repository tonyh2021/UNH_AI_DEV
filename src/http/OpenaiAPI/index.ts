import {OPENAI_API_KEY} from '@env';
import axios from 'axios';
import {
  AIMessageResponseType,
  AIMessageType,
  OpenAIModel,
  OpenaiTTSRequestParams,
  OpenaiTTSResponse,
} from '../type';
import {useModelStore} from '../useModelStore';
import RNFS from 'react-native-fs';

const BASE_URL = 'https://api.openai.com/v1/chat/completions';

interface Content {
  type: string;
  text?: string;
  image_url?: {
    url: string; // Base64 of image, data:image/jpeg;base64,...
  };
}

export const requestOpenai = async (params: {
  model?: OpenAIModel;
  messages: AIMessageType[];
}): Promise<AIMessageResponseType> => {
  const model = useModelStore.getState().openAIModel;
  const {messages} = params;

  const contents = [] as {
    role: string;
    content: Content[];
  }[];
  messages.map(message => {
    const content = [] as Content[];

    if (message.imageType && message.base64) {
      content.push({
        type: 'text',
        text: 'Caption this image.',
      });
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:${message.imageType};base64, ${message.base64}`,
        },
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

const BASE_URL_SPEECH = 'https://api.openai.com/v1/audio/speech';

export const requestOpenaiTTS = async (
  params: OpenaiTTSRequestParams,
): Promise<OpenaiTTSResponse> => {
  const {text} = params;

  const model = 'tts-1';
  const voice = 'alloy';

  const data = {
    model,
    input: text,
    voice,
  };

  const headers = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(BASE_URL_SPEECH, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // Function to convert Blob to Base64
    const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Ensure that the result is a string (data URL)
          if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]); // Extract base64 part
          } else {
            reject(
              new Error(
                'Failed to convert blob to base64: result is not a string.',
              ),
            );
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    // Generate a timestamp to create a unique file name
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const outputPath = `${RNFS.DocumentDirectoryPath}/speech_${timestamp}.mp3`;

    // Convert the response data (binary data) to a buffer
    const base64Data = await blobToBase64(blob);
    // Write the buffer to a file
    await RNFS.writeFile(outputPath, base64Data, 'base64');

    console.log('Audio File saved at:', outputPath);
    return {
      data: {
        audioPath: outputPath,
        text,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to generate speech: ${error.message}`);
  }
};
