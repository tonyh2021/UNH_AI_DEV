import {Robot} from '@/utils/RobotData';

export type RootStackParams = {
  Home: undefined;
  OpenAI: {robot: Robot};
  Gemini: {robot: Robot};
  HomeTab: undefined;
  EmptyPage: undefined;
  RNIntro: undefined;
  MessageDemo: undefined;
};
