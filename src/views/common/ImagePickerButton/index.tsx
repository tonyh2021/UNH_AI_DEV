import appStyles from '@/utils/styleHelper';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-remix-icon';
import * as ImagePicker from 'react-native-image-picker';
import React, {useRef} from 'react';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  color?: string;
  onPick?: (image: ImagePicker.Asset) => void;
}

const ImagePickerButton = (props: Props) => {
  const {color = appStyles.color.primary} = props;
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const commonOptions = {
    mediaType: 'photo',
    presentationStyle: 'fullScreen',
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.7,
    includeBase64: true,
  } as ImagePicker.OptionsCommon;

  const pickFromCamera = async () => {
    try {
      const options = {
        ...commonOptions,
        saveToPhotos: false,
      } as ImagePicker.CameraOptions;
      const response = await ImagePicker.launchCamera(options);
      if (response.assets && response.assets.length > 0) {
        if (response.assets[0]) {
          console.log('pickFromCamera', response.assets[0].uri);
          return Promise.resolve(response.assets[0]);
        }
      } else if (response.errorCode) {
        return Promise.reject(response);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const pickFromAlbum = async () => {
    try {
      const options = {
        ...commonOptions,
      } as ImagePicker.ImageLibraryOptions;
      const response = await ImagePicker.launchImageLibrary(options);
      if (response.assets && response.assets.length > 0) {
        if (response.assets[0]) {
          console.log('pickFromAlbum', response.assets[0].uri);
          return Promise.resolve(response.assets[0]);
        }
      } else if (response.errorCode) {
        return Promise.reject(response);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          actionSheetRef.current?.show();
        }}>
        <Icon name="image-ai-fill" size="22" color={color}></Icon>
      </TouchableOpacity>
      <ActionSheet ref={actionSheetRef} safeAreaInsets={insets}>
        <View style={styles.actionWrap}>
          <TouchableOpacity
            style={{...styles.actionButton, backgroundColor: color}}
            onPress={async () => {
              try {
                const result = await pickFromCamera();
                console.log('pickFromCamera res', result?.uri);
                if (result) {
                  props.onPick?.(result);
                }
              } catch (error) {
                console.log('pickFromCamera error', error);
              } finally {
                actionSheetRef.current?.hide();
              }
            }}>
            <Text style={styles.actionTitle}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.actionButton,
              backgroundColor: color,
              marginTop: 10,
            }}
            onPress={async () => {
              try {
                const result = await pickFromAlbum();
                console.log('pickFromAlbum res', result?.uri);
                if (result) {
                  props.onPick?.(result);
                }
              } catch (error) {
                console.log('pickFromAlbum error', error);
              } finally {
                actionSheetRef.current?.hide();
              }
            }}>
            <Text style={styles.actionTitle}>Library</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </>
  );
};

export default ImagePickerButton;

const styles = StyleSheet.create({
  actionWrap: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: 40,
    borderRadius: 5,
    color: appStyles.color.background,
  },
  actionTitle: {
    fontSize: 16,
    color: appStyles.color.background,
  },
});
