import appStyles from '@/utils/styleHelper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
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

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: appStyles.color.primary,
  },
});
