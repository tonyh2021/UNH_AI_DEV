import appStyles from '@/utils/styleHelper';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {IMessage} from 'react-native-gifted-chat';
import Icon from 'react-native-remix-icon';
import Tts from 'react-native-tts';
import useTtsStore, {TtsState} from './useTtsStore';
import {useShallow} from 'zustand/react/shallow';

interface Props {
  color?: string;
  message: IMessage;
}

const TTSButton = (props: Props) => {
  const {color = appStyles.color.primary, message} = props;

  const {ttsStatus, setTtsStatus} = useTtsStore(
    useShallow(state => ({
      ttsStatus: state.ttsStatus,
      setTtsStatus: state.setTtsStatus,
    })),
  );

  const onStart = () => {
    console.log('onStart', message);
    setTtsStatus({
      ...ttsStatus,
      status: TtsState.started,
    });
  };

  const onFinish = () => {
    console.log('onFinish');
    setTtsStatus({
      speakingId: null,
      status: TtsState.finished,
    });
  };
  const onCancel = () => {
    console.log('onCancel');
    setTtsStatus({
      speakingId: null,
      status: TtsState.cancelled,
    });
  };

  useEffect(() => {
    Tts.setIgnoreSilentSwitch('ignore');
    Tts.getInitStatus().then(result => {
      Tts.addEventListener('tts-start', onStart);
      Tts.addEventListener('tts-finish', onFinish);
      Tts.addEventListener('tts-cancel', onCancel);
    });
    return () => {
      Tts.stop();
      try {
        Tts.removeEventListener('tts-start', onStart);
        Tts.removeEventListener('tts-finish', onFinish);
        Tts.removeEventListener('tts-cancel', onCancel);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  const renderIcon = () => {
    const isSpeaking =
      ttsStatus.status === TtsState.started &&
      message._id === ttsStatus.speakingId;
    console.log('isSpeaking', isSpeaking);
    if (isSpeaking) {
      return (
        <ActivityIndicator
          style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
          size="small"
          color={color}
          animating={true}></ActivityIndicator>
      );
    }
    return <Icon name="volume-up-fill" size="16" color={color}></Icon>;
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        onPress={() => {
          Tts.stop();
          Tts.speak(message.text);
          setTtsStatus({
            ...ttsStatus,
            speakingId: message._id,
          });
        }}>
        {renderIcon()}
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
