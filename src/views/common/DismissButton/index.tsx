import React from 'react';
import {StyleSheet, Pressable, Keyboard} from 'react-native';

const DismissButton = () => {
  return (
    <Pressable
      style={styles.wrap}
      onPress={() => Keyboard.dismiss()}></Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '50%',
    width: '50%',
    backgroundColor: 'transparent',
  },
});

export default DismissButton;
