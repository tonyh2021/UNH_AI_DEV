import {create} from 'zustand';

export enum TtsStatus {
  initiliazing = 'initiliazing',
  started = 'started',
  finished = 'finished',
  cancelled = 'cancelled',
}

interface TtsStore {
  ttsStatus: TtsStatus;
  setTtsStatus: (status: TtsStatus) => void;
}

const useTtsStore = create<TtsStore>(set => ({
  ttsStatus: TtsStatus.initiliazing,
  setTtsStatus: status => set({ttsStatus: status}),
}));

export default useTtsStore;
