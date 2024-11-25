import {create} from 'zustand';
import Tts from 'react-native-tts';

interface TtsStore {
  speakingId: string | number | null;
  setSpeakingId: (id: string | number | null) => void;
  ttsStatus: string;
  setTtsStatus: (status: string) => void;
  startTts: (text: string) => void;
  stopTts: () => void;
}

const useTtsStore = create<TtsStore>(set => ({
  speakingId: null,
  ttsStatus: 'initiliazing',
  setSpeakingId: id => set({speakingId: id}),
  setTtsStatus: status => set({ttsStatus: status}),
  startTts: text => {
    Tts.stop();
    Tts.speak(text);
    set({ttsStatus: 'started'});
  },
  stopTts: () => {
    Tts.stop();
    set({ttsStatus: 'finished'});
  },
}));

export default useTtsStore;
