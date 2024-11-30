import appStyles from '@/utils/styleHelper';
import React, {useRef} from 'react';
import {StyleSheet, TouchableOpacity, Text, Modal, View} from 'react-native';
import {Robot} from '@/utils/RobotData';
import {useModelStore} from '@/http/useModelStore';
import {AIPlatformType, GeminiModel, OpenAIModel} from '@/http/type';
import RNPickerSelect from 'react-native-picker-select';

interface Props {
  robot: Robot;
}

const ModelPicker = (props: Props) => {
  const {robot} = props;

  const {openAIModel, setOpenAIModel, geminiModel, setGeminiModel} =
    useModelStore(state => state);

  const renderItems = () => {
    if (robot.target === AIPlatformType.OpenAI) {
      return [
        {label: 'GPT-4o', value: OpenAIModel.GPT_4_O},
        {label: 'GPT-4o mini', value: OpenAIModel.GPT_4_MINI},
        {label: 'GPT-4 Turbo', value: OpenAIModel.GPT_4_TURBO},
        {label: 'GPT-3.5 Turbo', value: OpenAIModel.GPT_35_TURBO},
      ];
    } else {
      return [
        {label: 'Gemini 1.5 Flash', value: GeminiModel.GEMINI_15_FLASH},
        {label: 'Gemini 1.5 Flash-8B', value: GeminiModel.GEMINI_15_FLASH_8B},
        {label: 'Gemini 1.5 Pro', value: GeminiModel.GEMINI_15_PRO},
      ];
    }
  };

  const renderPicker = () => {
    const value =
      robot.target === AIPlatformType.OpenAI ? openAIModel : geminiModel;
    return (
      <RNPickerSelect
        placeholder={{label: 'Select a model', value: ''}}
        value={value}
        onValueChange={value => {
          console.log(value);
          if (robot.target === AIPlatformType.OpenAI) {
            setOpenAIModel(value);
          } else {
            setGeminiModel(value);
          }
        }}
        items={renderItems()}
        style={{
          inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: robot.primary,
            borderRadius: 4,
            color: robot.primary,
            paddingRight: 30, // to ensure the text is not overlapping the icon
          },
          inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: robot.primary,
            borderRadius: 8,
            color: robot.primary,
            paddingRight: 30, // to ensure the text is not overlapping the icon
          },
        }}
        useNativeAndroidPickerStyle={false}
      />
    );
  };

  return <View style={{...styles.actionWrap}}>{renderPicker()}</View>;
};

const styles = StyleSheet.create({
  actionWrap: {
    height: 40,
  },
  button: {},
  text: {
    fontSize: 19,
    color: appStyles.color.background,
    fontWeight: 'bold',
  },
});

export default ModelPicker;
