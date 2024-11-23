export type Robot = {
  id: string;
  name: string;
  image: string;
  primary: string;
  target: 'OpenAI' | 'Other';
};

export const RobotData: Robot[] = [
  {
    id: '0',
    name: 'Nova',
    image: 'https://tonyh2021.github.io/images/ai/avatar/robot1.png',
    primary: '#2864f0',
    target: 'OpenAI',
  },
  {
    id: '1',
    name: 'Echo',
    image: 'https://tonyh2021.github.io/images/ai/avatar/robot2.png',
    primary: '#994aff',
    target: 'OpenAI',
  },
  {
    id: '2',
    name: 'Lumi',
    image: 'https://tonyh2021.github.io/images/ai/avatar/robot3.png',
    primary: '#ff432e',
    target: 'OpenAI',
  },
];
