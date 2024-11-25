import appStyles from '@/utils/styleHelper';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-remix-icon';
import Tts from 'react-native-tts';

interface Props {
  color?: string;
  text?: string;
}

enum TtsStatus {
  initiliazing = 'initiliazing',
  started = 'started',
  finished = 'finished',
  cancelled = 'cancelled',
}

const TTSButton = (props: Props) => {
  const {color = appStyles.color.primary, text = ''} = props;
  const [ttsStatus, setTtsStatus] = useState<TtsStatus>(TtsStatus.initiliazing);

  const onStart = () => {
    console.log('onStart');
    setTtsStatus(TtsStatus.started);
  };
  const onFinish = () => {
    console.log('onFinish');
    setTtsStatus(TtsStatus.finished);
  };
  const onCancel = () => {
    console.log('onCancel');
    setTtsStatus(TtsStatus.cancelled);
  };

  useEffect(() => {
    Tts.setIgnoreSilentSwitch('ignore');
    Tts.getInitStatus().then(result => {
      console.log(result);
      Tts.addEventListener('tts-start', onStart);
      Tts.addEventListener('tts-finish', onFinish);
      Tts.addEventListener('tts-cancel', onCancel);
    });
    return () => {
      Tts.stop();
      Tts.removeEventListener('tts-start', onStart);
      Tts.removeEventListener('tts-finish', onFinish);
      Tts.removeEventListener('tts-cancel', onCancel);
    };
  }, []);

  const renderIcon = () => {
    if (ttsStatus === TtsStatus.started) {
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
        onPress={async () => {
          Tts.stop();
          Tts.speak(text);
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
