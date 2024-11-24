import appStyles from '@/utils/styleHelper';
import {StyleSheet, View} from 'react-native';
import {Send} from 'react-native-gifted-chat';
import Icon from 'react-native-remix-icon';

interface Props {
  color?: string;
}

const SendButton = (props: Props) => {
  const {color = appStyles.color.primary} = props;
  return (
    <Send {...props}>
      <View style={styles.button}>
        <Icon name="send-plane-fill" size="24" color={color}></Icon>
      </View>
    </Send>
  );
};

export default SendButton;

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    marginBottom: 5,
  },
});
