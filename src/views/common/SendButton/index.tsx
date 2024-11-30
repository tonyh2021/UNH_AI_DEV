import appStyles from '@/utils/styleHelper';
import {StyleSheet, View} from 'react-native';
import {Send} from 'react-native-gifted-chat';
import Icon from 'react-native-remix-icon';

interface Props {
  color?: string;
  disabled: boolean;
}

const SendButton = (props: Props) => {
  const {color = appStyles.color.primary, disabled} = props;
  return (
    <Send
      {...props}
      containerStyle={{
        padding: 8,
        backgroundColor: appStyles.color.background,
      }}>
      <View style={styles.button}>
        <Icon
          name="send-plane-fill"
          size="24"
          color={disabled ? color + '4D' : color}></Icon>
      </View>
    </Send>
  );
};

export default SendButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: appStyles.color.background,
  },
});
