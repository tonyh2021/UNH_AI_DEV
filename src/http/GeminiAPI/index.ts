import {GEMINI_API_KEY} from '@env';
import axios from 'axios';

const BASE_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

export const requestGemini = async (text: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text,
              },
            ],
          },
        ],
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
          contents: [
            {
              parts: [
                {
                  text: response.data.candidates[0].content.parts[0].text,
                },
              ],
            },
          ],
        },
      };
    } else {
      throw new Error('Invalid response structure from Gemini API');
    }
  } catch (error) {
    throw error;
  }
};
