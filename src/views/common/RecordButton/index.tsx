import appStyles from '@/utils/styleHelper';
import {useEffect, useRef, useState} from 'react';
import LottieView from 'lottie-react-native';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-remix-icon';

interface Props {
  color?: string;
}

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.3);

const RecordButton = (props: Props) => {
  const {color = appStyles.color.primary} = props;

  const [recordState, setRecordState] = useState({
    recordSecs: 0,
    metering: 0,
  });

  const startRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder(
      undefined,
      undefined,
      true,
    );
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordState({
        recordSecs: e.currentPosition,
        metering: e.currentMetering ? e.currentMetering : 0,
      });
      return;
    });
    console.log('startRecord result', result);
  };

  const stopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordState({
      ...recordState,
      recordSecs: 0,
    });
    console.log('stopRecord result', result);
  };

  useEffect(() => {
    return () => {
      if (recordState.recordSecs > 0) {
        audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
      }
    };
  }, []);

  useEffect(() => {
    console.log('recordState', recordState);
  }, [recordState]);

  const renderIndicator = () => {
    const timeText = audioRecorderPlayer.mmssss(recordState.recordSecs);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{width: 200, height: 200}}>
          <LottieView
            source={require('@/assets/lottie/wave.json')}
            style={{width: '100%', height: '100%'}}
            autoPlay
            loop
          />
        </View>
        <Text style={styles.time}>
          {timeText.slice(0, timeText.length - 3)}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await stopRecord();
          }}>
          <Icon
            name="stop-circle-fill"
            size="80"
            color={appStyles.color.error}></Icon>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={async () => {
        startRecord();
      }}>
      <Icon name="chat-voice-ai-fill" size="22" color={color}></Icon>
      <Modal
        animationType="fade"
        transparent={true}
        visible={recordState.recordSecs > 0}>
        {renderIndicator()}
      </Modal>
    </TouchableOpacity>
  );
};

export default RecordButton;

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
  },
  time: {
    fontSize: 30,
    color: appStyles.color.background,
    marginVertical: 10,
  },
});
