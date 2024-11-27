import appStyles from '@/utils/styleHelper';
import {useEffect, useRef, useState} from 'react';
import LottieView from 'lottie-react-native';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-remix-icon';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechVolumeChangeEvent,
} from '@react-native-voice/voice';
import {delayFunc} from '@/utils/delayFunc';

interface Props {
  color?: string;
  recognizeCallback?: (text: string) => void;
}

const SpeechButton = (props: Props) => {
  const {color = appStyles.color.primary, recognizeCallback} = props;

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const [showWave, setShowWave] = useState(false);

  const [speechResult, setSpeechResult] = useState<string | undefined>();

  const onSpeechStart = (e: SpeechStartEvent) => {
    console.log('onSpeechStart: ', e);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
  };

  const onSpeechEnd = (e: SpeechEndEvent) => {
    console.log('onSpeechEnd: ', e);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', JSON.stringify(e.error));
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e.value);
    if (e.value && e.value.length > 0) {
      const result = e.value[0];
      if (result !== '') {
        setSpeechResult(result);
      }
    }
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults: ', e.value);
  };

  const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
    console.log('onSpeechVolumeChanged: ', e.value);
    if (e.value && !isNaN(e.value)) {
      setShowWave(e.value > 1.5);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = onSpeechEnd;
    return () => {
      stopRecognizing().then(async () => {
        await cancelRecognizing();
        await destroyRecognizer();
        Voice.removeAllListeners;
      });
    };
  }, []);

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      actionSheetRef.current?.hide();
      recognizeCallback?.(speechResult || '');
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
  };

  const renderTranscribe = () => {
    return (
      <View
        style={{
          height: 500,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <ScrollView style={styles.textWrap}>
          <Text style={styles.text}>{speechResult || ''}</Text>
        </ScrollView>
        <View style={{...styles.wave, opacity: showWave ? 1 : 0}}>
          <LottieView
            source={require('@/assets/lottie/wave.json')}
            style={{width: '100%', height: '100%'}}
            autoPlay
            loop
          />
        </View>
        {
          <TouchableOpacity
            style={styles.recordButton}
            onPress={async () => {
              stopRecognizing();
            }}>
            <Icon
              name="stop-circle-fill"
              size="70"
              color={appStyles.color.error}></Icon>
          </TouchableOpacity>
        }
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          actionSheetRef.current?.show();
          setSpeechResult(undefined);
          setShowWave(false);
          delayFunc(1000).then(() => {
            startRecognizing();
          });
        }}>
        <Icon name="chat-voice-ai-fill" size="22" color={color}></Icon>
      </TouchableOpacity>
      <ActionSheet ref={actionSheetRef} safeAreaInsets={insets}>
        {renderTranscribe()}
      </ActionSheet>
    </>
  );
};

export default SpeechButton;

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
  textWrap: {
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: appStyles.color.primary,
    marginVertical: 10,
    height: '100%',
  },
  wave: {
    width: 200,
    height: 150,
  },
  recordButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
