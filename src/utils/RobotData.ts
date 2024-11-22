import {ImageSourcePropType} from 'react-native';

export type Robot = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  primary: string;
  target: 'OpenAI' | 'Other';
};

export const RobotData: Robot[] = [
  {
    id: '1',
    name: 'Nova',
    image: require('@/images/avatar/robot1.png'),
    primary: '#2864f0',
    target: 'OpenAI',
  },
  {
    id: '2',
    name: 'Echo',
    image: require('@/images/avatar/robot2.png'),
    primary: '#994aff',
    target: 'OpenAI',
  },
  {
    id: '3',
    name: 'Lumi',
    image: require('@/images/avatar/robot3.png'),
    primary: '#ff432e',
    target: 'OpenAI',
  },
];
