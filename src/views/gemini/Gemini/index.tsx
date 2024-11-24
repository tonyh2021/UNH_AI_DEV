import React, {useState, useCallback, useEffect, useLayoutEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Image} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  IMessage,
} from 'react-native-gifted-chat';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {Robot} from '@/utils/RobotData';
import Icon from 'react-native-remix-icon';
import {requestGemini} from '@/http/GeminiAPI';
import appStyles from '@/utils/styleHelper';
import Header from '@/navigation/Header';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import BackButton from '@/navigation/BackButton';
import {RootStackParams} from '@/navigation/types/RootStackParams';

interface Props {
  robot: Robot;
}

const Gemini = () => {
  const param = useRoute().params as Props;
  const robot = param.robot;

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const robotUser = {
    _id: robot.id,
    name: robot.name,
    avatar: robot.image,
  };

  useLayoutEffect(() => {
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

  useEffect(() => {
    const message = {
      _id: 0,
      text: `Hello, I am ${robot.name}`,
      createdAt: new Date(),
      user: robotUser,
    };
    setMessages([message]);
  }, []);

  const renderAvatar = () => {
    return <Image style={styles.avatar} source={{uri: robot.image}} />;
  };

  const onSend = useCallback((newMessages: IMessage[]) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
    setLoading(true);
    if (newMessages[0]?.text) {
      fetchGeminiResponse(newMessages[0].text);
    }
  }, []);

  const fetchGeminiResponse = async (text: string) => {
    try {
      const response = await requestGemini(text);
      const geminiData =
        response.data?.contents[0]?.parts[0]?.text ||
        'Sorry 🙏 No data found 😢';
      const apiMessage = {
        _id: Date.now(),
        text: geminiData,
        createdAt: new Date(),
        user: robotUser,
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [apiMessage]),
      );
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      const errorMessage = {
        _id: Date.now(),
        text: 'Oops! Something went wrong. Please try again later.',
        createdAt: new Date(),
        user: robotUser,
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [errorMessage]),
      );
    } finally {
      setLoading(false);
    }
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: robot.primary,
          },
          left: {
            backgroundColor: appStyles.color.lightGrey,
          },
        }}
        textStyle={{
          right: {
            color: appStyles.color.background,
          },
          left: {
            color: appStyles.color.primary,
          },
        }}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Icon name="send-plane-fill" size="24" color={robot.primary}></Icon>
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: appStyles.color.background,
          borderTopColor: appStyles.color.lightGrey,
          borderTopWidth: 1,
        }}
        textInputStyle={{
          color: appStyles.color.primary,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        isTyping={loading}
        onSend={onSend}
        user={{_id: 1}}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderAvatar={renderAvatar}
        showAvatarForEveryMessage={true}
        alwaysShowSend
        scrollToBottom
        placeholder="Type your message here..."
        timeTextStyle={{
          right: {color: appStyles.color.background},
          left: {color: appStyles.color.secondary},
        }}
      />
    </SafeAreaView>
  );
};

export default Gemini;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyles.color.background,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: appStyles.color.lightGrey,
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
  },
});
