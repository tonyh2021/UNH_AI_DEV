import appStyles from '@/utils/styleHelper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../types/RootStackParams';
import Icon from 'react-native-remix-icon';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface Props {
  tintColor?: string;
  onPress?: () => void;
}

const SettingsButton = (props: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {tintColor = appStyles.color.primary, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="information-2-line" size="28" color={tintColor}></Icon>
    </TouchableOpacity>
  );
};

export default SettingsButton;
