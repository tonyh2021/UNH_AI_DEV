import appStyles from '@/utils/styleHelper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Send} from 'react-native-gifted-chat';
import Icon from 'react-native-remix-icon';

interface Props {
  color?: string;
}

const RecordButton = (props: Props) => {
  const {color = appStyles.color.primary} = props;
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        console.log('onPressActionButton 1');
      }}>
      <Icon name="chat-voice-ai-fill" size="22" color={color}></Icon>
    </TouchableOpacity>
  );
};

export default RecordButton;

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
});
