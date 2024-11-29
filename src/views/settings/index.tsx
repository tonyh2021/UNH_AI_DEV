import {AIPlatformType} from '@/http/type';
import BackButton from '@/navigation/BackButton';
import Header from '@/navigation/Header';
import {RootStackParams} from '@/navigation/types/RootStackParams';
import {Robot} from '@/utils/RobotData';
import appStyles from '@/utils/styleHelper';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';
import {Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import ModelPicker from '@/views/common/ModelPicker';

interface Props {
  robot: Robot;
}

const Settings = () => {
  const param = useRoute().params as Props;
  const robot = param.robot;

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props: HeaderBackButtonProps) => (
        <BackButton {...props} tintColor={robot.primary} />
      ),
      headerTitle: () =>
        Header({
          avatar: robot.image,
          name: robot.name,
          color: robot.primary,
        }),
    });
  }, [navigation]);

  const openURL = async (url: string) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: robot.primary,
          preferredControlTintColor: appStyles.color.background,
          readerMode: false,
          animated: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: robot.primary,
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
        console.log(JSON.stringify(result));
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    if (robot.target === AIPlatformType.Gemini) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Gemini API</Text>
          <Text style={styles.subtitle}>Discover the Power of Gemini API</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.text}>
              The Gemini API is an advanced suite of AI interfaces designed for
              text, audio, and image processing. Whether you need content
              generation or interactive analysis, Gemini API has you covered.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Text Processing:</Text> Offers text
              generation, translation, and summarization.{'\n'}
              <Text style={styles.bold}>Audio Processing:</Text> Enables
              speech-to-text, text-to-speech, and audio analysis.{'\n'}
              <Text style={styles.bold}>Image Processing:</Text> Supports image
              generation, editing, and analysis.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Variants</Text>
            <Text style={styles.text}>
              Gemini API provides multiple model variants to cater to different
              use cases and performance requirements:
            </Text>
            <Text style={styles.text}>
              <Text
                style={[styles.bold, styles.link]}
                onPress={() =>
                  openURL(
                    'https://ai.google.dev/gemini-api/docs/models/gemini#gemini-1.5-flash',
                  )
                }>
                Gemini 1.5 Flash:
              </Text>{' '}
              Gemini 1.5 Flash is a fast and versatile multimodal model for
              scaling across diverse tasks.{'\n'}
              <Text
                style={[styles.bold, styles.link]}
                onPress={() =>
                  openURL(
                    'https://ai.google.dev/gemini-api/docs/models/gemini#gemini-1.5-flash-8b',
                  )
                }>
                Gemini 1.5 Flash-8B:
              </Text>{' '}
              Gemini 1.5 Flash-8B is a small model designed for lower
              intelligence tasks.
              {'\n'}
              <Text
                style={[styles.bold, styles.link]}
                onPress={() =>
                  openURL(
                    'https://ai.google.dev/gemini-api/docs/models/gemini#gemini-1.5-pro',
                  )
                }>
                Gemini 1.5 Pro:
              </Text>{' '}
              Gemini 1.5 Pro is a mid-size multimodal model that is optimized
              for a wide-range of reasoning tasks. 1.5 Pro can process large
              amounts of data at once, including 2 hours of video, 19 hours of
              audio, codebases with 60,000 lines of code, or 2,000 pages of
              text.{'\n'}
            </Text>
            <Text style={{...styles.bold, paddingBottom: 5}}>
              Select a Gemini model:
            </Text>
            <ModelPicker robot={robot}></ModelPicker>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Integration Tips</Text>
            <Text style={styles.text}>
              Gemini API can be integrated into mobile apps, websites, or
              backend services to enhance user experiences and product
              capabilities.
            </Text>
          </View>
        </ScrollView>
      );
    } else if (robot.target === AIPlatformType.OpenAI) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>OpenAI API</Text>
          <Text style={styles.subtitle}>
            Unlock the power of artificial intelligence with OpenAI's suite of
            APIs.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.text}>
              The OpenAI API offers powerful machine learning models that
              provide advanced capabilities for text, code, image, and speech
              processing. These APIs are designed to integrate seamlessly into
              your applications to deliver exceptional AI-driven experiences.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Text Generation:</Text> Generate
              coherent and contextually accurate text for a variety of use
              cases.{'\n'}
              <Text style={styles.bold}>Code Assistance:</Text> Write, debug,
              and optimize code across multiple languages.{'\n'}
              <Text style={styles.bold}>Image Generation:</Text> Create or
              enhance images using the DALL·E models.{'\n'}
              <Text style={styles.bold}>Speech Processing:</Text> Transform
              speech to text or generate speech from text.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Variants</Text>
            <Text style={styles.text}>
              OpenAI offers several model families tailored for different tasks:
            </Text>
            <Text style={styles.text}>
              <Text
                style={[styles.link, styles.bold]}
                onPress={() =>
                  openURL('https://platform.openai.com/docs/models#gpt-4o')
                }>
                GPT-4o:
              </Text>{' '}
              Our high-intelligence flagship model for complex, multi-step tasks
              {'\n'}
              <Text
                style={[styles.link, styles.bold]}
                onPress={() =>
                  openURL('https://platform.openai.com/docs/models#gpt-4o-mini')
                }>
                GPT-4o mini:
              </Text>{' '}
              Our affordable and intelligent small model for fast, lightweight
              tasks{'\n'}
              <Text
                style={[styles.link, styles.bold]}
                onPress={() =>
                  openURL(
                    'https://platform.openai.com/docs/models#gpt-4-turbo-and-gpt-4e',
                  )
                }>
                GPT-4 Turbo:
              </Text>{' '}
              The previous set of high-intelligence models.{'\n'}
              <Text
                style={[styles.link, styles.bold]}
                onPress={() =>
                  openURL(
                    'https://platform.openai.com/docs/models#gpt-3-5-turbo',
                  )
                }>
                GPT-3.5 Turbo:
              </Text>{' '}
              A fast, inexpensive model for simple tasks.{'\n'}
            </Text>
            <Text style={{...styles.bold, paddingBottom: 5}}>
              Select a OpenAI model:
            </Text>
            <ModelPicker robot={robot}></ModelPicker>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Integration Tips</Text>
            <Text style={styles.text}>
              OpenAI's APIs can be easily integrated into applications for:
            </Text>
            <Text style={styles.text}>
              - Automating content creation{'\n'}- Enhancing customer support
              with AI-driven chatbots{'\n'}- Building intelligent coding
              assistants{'\n'}- Developing innovative multimedia applications
            </Text>
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: appStyles.color.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: appStyles.color.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: appStyles.color.secondary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: appStyles.color.primary,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: appStyles.color.primary,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    textDecorationLine: 'underline',
  },
});

export default Settings;
