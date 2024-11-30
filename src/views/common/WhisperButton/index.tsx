import appStyles from '@/utils/styleHelper';
import {useEffect, useRef, useState} from 'react';
import LottieView from 'lottie-react-native';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-remix-icon';
import {AudioSessionIos, initWhisper, WhisperContext} from 'whisper.rn';
import RNFS from 'react-native-fs';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

interface Props {
  color?: string;
}

const WhisperButton = (props: Props) => {
  const {color = appStyles.color.primary} = props;

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const whisperContextRef = useRef<WhisperContext>();

  const [initilized, setInitilized] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  const [stopTranscribe, setStopTranscribe] = useState<{
    stop: () => void;
  } | null>(null);
  const [transcibeResult, setTranscibeResult] = useState<string>();

  const setupWhisper = async () => {
    const fileName = 'ggml-small.en.bin';
    const resourceUri = `${RNFS.MainBundlePath}/${fileName}`;
    const exists = await RNFS.exists(resourceUri);
    if (exists) {
      const whisperContext = await initWhisper({
        filePath: resourceUri,
      });
      whisperContextRef.current = whisperContext;
      console.log('whisperContext', whisperContext);

      await AudioSessionIos.setCategory(
        AudioSessionIos.Category.PlayAndRecord,
        [AudioSessionIos.CategoryOption.MixWithOthers],
      );
      await AudioSessionIos.setMode(AudioSessionIos.Mode.Default);
      await AudioSessionIos.setActive(true);

      setInitilized(true);
    }
  };

  useEffect(() => {
    setupWhisper();
    return () => {};
  }, []);

  const toTimestamp = (t: number, comma = false) => {
    let msec = t * 10;
    const hr = Math.floor(msec / (1000 * 60 * 60));
    msec -= hr * (1000 * 60 * 60);
    const min = Math.floor(msec / (1000 * 60));
    msec -= min * (1000 * 60);
    const sec = Math.floor(msec / 1000);
    msec -= sec * 1000;

    const separator = comma ? ',' : '.';
    const timestamp = `${String(hr).padStart(2, '0')}:${String(min).padStart(
      2,
      '0',
    )}:${String(sec).padStart(2, '0')}${separator}${String(msec).padStart(
      3,
      '0',
    )}`;

    return timestamp;
  };

  const startTranscribe = async () => {
    if (!whisperContextRef.current) {
      return;
    }
    console.log('transcribeRealtime');

    const whisperContext = whisperContextRef.current;

    try {
      const recordFile = `${RNFS.DocumentDirectoryPath}/realtime.wav`;
      const exists = await RNFS.exists(recordFile);
      if (exists) {
        await RNFS.unlink(recordFile);
      }
      const {stop, subscribe} = await whisperContext.transcribeRealtime({
        maxLen: 1,
        language: 'en',
        // Enable beam search (may be slower than greedy but more accurate)
        // beamSize: 2,
        // Record duration in seconds
        realtimeAudioSec: 60,
        // Slice audio into 25 (or < 30) sec chunks for better performance
        realtimeAudioSliceSec: 25,
        // Save audio on stop
        audioOutputPath: recordFile,
        // iOS Audio Session
        audioSessionOnStartIos: {
          category: AudioSessionIos.Category.PlayAndRecord,
          options: [
            AudioSessionIos.CategoryOption.MixWithOthers,
            AudioSessionIos.CategoryOption.AllowBluetooth,
          ],
          mode: AudioSessionIos.Mode.Default,
        },
        audioSessionOnStopIos: 'restore', // Or an AudioSessionSettingIos
        // Voice Activity Detection - Start transcribing when speech is detected
        // useVad: true,
      });
      setStopTranscribe({stop});
      setIsRecording(true);
      subscribe(evt => {
        const {isCapturing, data, processTime, recordingTime} = evt;
        // const log =
        //   `Realtime transcribing: ${isCapturing ? 'ON' : 'OFF'}\n` +
        //   `Result: ${data?.result}\n\n` +
        //   `Process time: ${processTime}ms\n` +
        //   `Recording time: ${recordingTime}ms` +
        //   `\n` +
        //   `Segments:` +
        //   `\n${data?.segments
        //     .map(
        //       segment =>
        //         `[${toTimestamp(segment.t0)} --> ${toTimestamp(segment.t1)}]  ${
        //           segment.text
        //         }`,
        //     )
        //     .join('\n')}`;
        // console.log(log);

        let result = data?.result.trim() || '';
        result = result.replace('[BLANK_AUDIO]', ' ');
        setTranscibeResult(result);

        if (!isCapturing) {
          setStopTranscribe(null);
          setIsRecording(false);
          console.log('Finished realtime transcribing');
        }
      });
    } catch (e) {
      console.log('Error:', e);
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
          <Text style={styles.text}>
            {transcibeResult ? transcibeResult : ''}
          </Text>
        </ScrollView>
        <View style={{...styles.wave, opacity: isRecording ? 1 : 0}}>
          <LottieView
            source={require('@/assets/lottie/wave.json')}
            style={{width: '100%', height: '100%'}}
            autoPlay
            loop
          />
        </View>
        {isRecording ? (
          <TouchableOpacity
            style={styles.recordButton}
            disabled={!initilized}
            onPress={async () => {
              stopTranscribe?.stop();
              setIsRecording(false);
            }}>
            <Icon
              name="stop-circle-fill"
              size="70"
              color={appStyles.color.error}></Icon>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.recordButton}
            disabled={!initilized}
            onPress={async () => {
              startTranscribe();
            }}>
            <Icon name="mic-ai-fill" size="50" color={color}></Icon>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          actionSheetRef.current?.show();
        }}>
        <Icon name="chat-voice-ai-fill" size="22" color={color}></Icon>
      </TouchableOpacity>
      <ActionSheet ref={actionSheetRef} safeAreaInsets={insets}>
        {renderTranscribe()}
      </ActionSheet>
    </>
  );
};

export default WhisperButton;

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
