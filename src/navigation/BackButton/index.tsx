import appStyles from '@/utils/styleHelper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/elements';
import {RootStackParams} from '../types/RootStackParams';

interface Props {
  tintColor?: string;
  onPress?: () => void;
}

const BackButton = (props: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {
    tintColor = appStyles.color.primary,
    onPress = () => {
      console.log('navigation goBack');
      navigation.goBack();
    },
  } = props;
  return (
    <HeaderBackButton tintColor={tintColor} label="   " onPress={onPress} />
  );
};

export default BackButton;
