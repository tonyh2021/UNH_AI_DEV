import {Robot} from '@/utils/RobotData';
import appStyles from '@/utils/styleHelper';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
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
  }, [robot]);

  // Ref to store the interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [text, setText] = useState(''); // State to store the current text to display
  const [subtitle, setSubtitle] = useState('');
  const [ellipses, setEllipses] = useState('');
  const interval = 10;

  const indexRef = useRef(0);

  // Function to simulate typing animation
  useEffect(() => {
    if (robot && robot.name) {
      indexRef.current = 0;

      const fullText = `Hello, I am ${robot.name}`; // Full text to display
      const fullSubtitle = `How can I help you?`;

      // Clear previous interval if it exists
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Clear previous text when robot changes
      setText('');
      setSubtitle('');
      setEllipses('');

      // Interval to reveal one character at a time
      intervalRef.current = setInterval(() => {
        if (indexRef.current < fullText.length) {
          setText(prev => prev + fullText[indexRef.current]); // Add one character at a time
          indexRef.current++;
        } else if (indexRef.current < fullText.length + interval) {
          indexRef.current++;
        } else if (indexRef.current < fullText.length + interval) {
          indexRef.current++;
        } else if (
          indexRef.current <
          fullText.length + fullSubtitle.length + interval
        ) {
          setSubtitle(
            prev =>
              prev +
              fullSubtitle[indexRef.current - fullText.length - interval],
          );
          indexRef.current++;
        } else {
          // Stop the interval once the entire text is displayed
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 100); // Adjust the interval to change typing speed
    }

    // Cleanup the interval when the component is unmounted or robot changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [robot]); // Re-run the effect when `robot` changes

  if (!robot) {
    return <></>;
  }

  return (
    <View style={styles.header}>
      <Animated.Image
        source={{uri: robot.image}}
        style={[styles.mainImage, animatedStyle]}
      />
      <Animated.Text style={[styles.greeting, {color: robot.primary}]}>
        {text}
      </Animated.Text>
      <View>
        <Animated.Text style={[styles.subtitle, {color: robot.primary}]}>
          {subtitle}
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, {color: robot.primary}]}>
          {ellipses}
        </Animated.Text>
      </View>
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
    height: 40,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 25,
    height: 30,
  },
});

export default MainAvatar;
