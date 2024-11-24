export type Robot = {
  id: string;
  name: string;
  image: string;
  primary: string;
  target: 'OpenAI' | 'Gemini' | 'Other';
};

export const RobotData: Robot[] = [
  {
    id: '10',
    name: 'Nova',
    image: 'https://tonyh2021.github.io/images/ai/avatar/robot1.png',
    primary: '#2864f0',
    target: 'OpenAI',
  },
  {
    id: '20',
    name: 'Echo',
    image: 'https://tonyh2021.github.io/images/ai/avatar/robot2.png',
    primary: '#994aff',
    target: 'Gemini',
  },
  {
    id: '30',
    name: 'Lumi',
    image: 'https://tonyh2021.github.io/images/ai/avatar/robot3.png',
    primary: '#ff432e',
    target: 'Gemini',
  },
];
