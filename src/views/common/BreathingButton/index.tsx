import appStyles from '@/utils/styleHelper';
import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  color?: string; // Optional property to allow customization of button color
  onPress?: () => void; // Optional property for button press callback
}

const BreathingButton = (props: Props) => {
  // Shared value to store the animation state
  const scale = useSharedValue(1);

  // Initialize the breathing animation
  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, {duration: 1500}), // Gradually scale up the button over 1.5 seconds
      -1, // Loop infinitely
      true, // Reverse animation direction for each loop
    );
  }, [scale]);

  // Animated style to bind the scale transformation to the button
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <TouchableOpacity style={{...styles.container}} onPress={props.onPress}>
      <Animated.View
        style={[
          {...styles.button, backgroundColor: props.color},
          animatedStyle,
        ]}>
        <Text style={styles.text}>Let's chat</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
  },
  button: {
    padding: 17,
    width: 250,
    borderRadius: 19,
    alignItems: 'center',
    marginTop: 30,
    elevation: 5,
    shadowColor: appStyles.color.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  text: {
    fontSize: 19,
    color: appStyles.color.background,
    fontWeight: 'bold',
  },
});

export default BreathingButton;
