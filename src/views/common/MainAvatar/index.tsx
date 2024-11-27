import {Robot} from '@/utils/RobotData';
import appStyles from '@/utils/styleHelper';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  robot?: Robot; // Optional property to allow customization of button color
}

const MainAvatar = (props: Props) => {
  const robot = props.robot;

  // Shared value for scale animation
  const scale = useSharedValue(1);

  // Animated style for the main image
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  // Trigger animation when `robot` changes
  useEffect(() => {
    if (robot) {
      // Animate the scale with a sequence: enlarge with spring and return to normal
      scale.value = withSequence(
        withSpring(1.2, {
          damping: 8, // Controls how quickly the spring stops bouncing (lower = more bounce)
          stiffness: 150, // Determines the speed of the spring animation (higher = faster)
        }), // Scale up to 1.2x
        withSpring(1, {
          damping: 10, // Slightly higher damping for smoother return
          stiffness: 120, // Slower return to original size
        }), // Scale back to original size
      );
    }
  }, [robot, scale]);

  if (!robot) {
    return <></>;
  }

  return (
    <View style={styles.header}>
      <Animated.Image
        source={{uri: robot.image}}
        style={[styles.mainImage, animatedStyle]}
      />
      <Text style={[styles.greeting, {color: robot.primary}]}>
        Hello, I am {robot.name}
      </Text>
      <Text style={[styles.subtitle, {color: robot.primary}]}>
        How can I help you?
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    width: '100%',
  },
  mainImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: appStyles.color.lightGrey,
  },
  greeting: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 25,
    marginTop: 20,
  },
});

export default MainAvatar;
