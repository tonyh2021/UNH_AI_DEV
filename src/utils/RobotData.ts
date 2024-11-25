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

export const fetchUserData = () => {
  const randomIndex = Math.floor(Math.random() * userData.length);
  return userData[randomIndex];
};

const userData = [
  {
    _id: '101',
    name: 'Tony',
    avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png',
  },
  {
    _id: '102',
    name: 'Tony',
    avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_2.png',
  },
  {
    _id: '103',
    name: 'Tony',
    avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png',
  },
  {
    _id: '104',
    name: 'Tony',
    avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_4.png',
  },
];
