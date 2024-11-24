import appStyles from '@/utils/styleHelper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-remix-icon';

interface Props {
  color?: string;
}

const TTSButton = (props: Props) => {
  const {color = appStyles.color.primary} = props;
  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        onPress={() => {
          console.log('tts');
        }}>
        <Icon name="volume-up-fill" size="16" color={color}></Icon>
      </TouchableOpacity>
    </View>
  );
};

export default TTSButton;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 8,
    bottom: 5,
    height: 30,
    width: 30,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
