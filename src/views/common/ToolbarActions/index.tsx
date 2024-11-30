import appStyles from '@/utils/styleHelper';
import {StyleSheet, View} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import React from 'react';
import {Actions} from 'react-native-gifted-chat';
import ImagePickerButton from '@/views/common/ImagePickerButton';
import SpeechButton from '@/views/common/SpeechButton';

interface Props {
  color?: string;
  onPickImage?: (image: ImagePicker.Asset) => void;
  onRecognize?: (text: string) => void; // recognize
}

const ToolbarActions = (props: Props) => {
  const {color = appStyles.color.primary} = props;

  return (
    <Actions
      containerStyle={styles.action}
      icon={() => (
        <View style={styles.wrap}>
          <ImagePickerButton
            color={color}
            onPick={(image: ImagePicker.Asset) => {
              console.log('onPick', image);
              props.onPickImage?.(image);
            }}></ImagePickerButton>
          <SpeechButton
            color={color}
            recognizeCallback={text => {
              console.log('recognizeCallback', text);
              props.onRecognize?.(text);
            }}></SpeechButton>
        </View>
      )}
    />
  );
};

export default ToolbarActions;

const styles = StyleSheet.create({
  action: {
    paddingHorizontal: 2,
    paddingTop: 4,
    width: 60,
    backgroundColor: appStyles.color.background,
  },
  wrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
