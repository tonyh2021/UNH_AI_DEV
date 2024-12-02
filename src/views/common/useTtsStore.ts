import {create} from 'zustand';

export enum TtsStatus {
  loading = 'loading',
  playing = 'playing',
  stopped = 'stopped',
}

interface TtsStore {
  ttsStatus: TtsStatus | undefined;
  setTtsStatus: (status: TtsStatus) => void;
}

const useTtsStore = create<TtsStore>(set => ({
  ttsStatus: undefined,
  setTtsStatus: status => set({ttsStatus: status}),
}));

export default useTtsStore;
