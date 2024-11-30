import {create} from 'zustand';
import {OpenAIModel, GeminiModel} from './type';

interface State {
  openAIModel: OpenAIModel;
  setOpenAIModel: (model: OpenAIModel) => void;

  geminiModel: GeminiModel;
  setGeminiModel: (model: GeminiModel) => void;
}

export const useModelStore = create<State>((set, get) => ({
  openAIModel: OpenAIModel.GPT_4_MINI,
  setOpenAIModel: (model: OpenAIModel) => {
    set({openAIModel: model});
  },
  geminiModel: GeminiModel.GEMINI_15_FLASH,
  setGeminiModel: (model: GeminiModel) => {
    set({geminiModel: model});
  },
}));
