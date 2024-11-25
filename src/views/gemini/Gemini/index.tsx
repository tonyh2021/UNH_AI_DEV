import React, {useState, useCallback, useEffect, useLayoutEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Image} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  IMessage,
} from 'react-native-gifted-chat';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {Robot} from '@/utils/RobotData';
import {requestGemini} from '@/http/GeminiAPI';
import appStyles from '@/utils/styleHelper';
import Header from '@/navigation/Header';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import BackButton from '@/navigation/BackButton';
import {RootStackParams} from '@/navigation/types/RootStackParams';
import {AIMessageType} from '@/http/type';
import TTSButton from '@/views/common/TTSButton';
import SendButton from '@/views/common/SendButton';

interface Props {
  robot: Robot;
}

const Gemini = () => {
  const param = useRoute().params as Props;
  const robot = param.robot;

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesRef = React.useRef(messages);
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
      _id: Date.now(),
      text: `Hello, I am ${robot.name}`,
      createdAt: new Date(),
      user: robotUser,
    };
    setMessages([message]);
    messagesRef.current = [message];
  }, []);

  const updateMessages = (messages: IMessage[]) => {
    setMessages(previousMessages => {
      const updatedMessages = GiftedChat.append(previousMessages, messages);
      messagesRef.current = updatedMessages;
      return updatedMessages;
    });
  };

  const renderAvatar = () => {
    return <Image style={styles.avatar} source={{uri: robot.image}} />;
  };

  const renderTTSButton = (message: IMessage) => {
    if (message.user._id !== robot.id) {
      return null;
    }
    return <TTSButton color={robot.primary} message={message}></TTSButton>;
  };

  const onSend = useCallback((newMessages: IMessage[]) => {
    updateMessages(newMessages);
    setLoading(true);
    if (newMessages[0]?.text) {
      fetchAPIResponse(newMessages[0].text);
    }
  }, []);

  const fetchAPIResponse = async (text: string) => {
    const aiMessages = [] as AIMessageType[];
    for (const message of messagesRef.current) {
      aiMessages.push({
        text: message.text,
        role: message.user._id === robot.id ? 'model' : 'user',
      });
    }

    try {
      const response = await requestGemini({
        messages: aiMessages.reverse(),
      });
      const responseMessage = {
        _id: Date.now(),
        text: response.data.text || 'Sorry. No data was found 😢',
        createdAt: new Date(),
        user: robotUser,
      };
      updateMessages([responseMessage]);
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      const errorMessage = {
        _id: Date.now(),
        text: 'Oops! Something went wrong. Please try again later.',
        createdAt: new Date(),
        user: robotUser,
      };
      updateMessages([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        renderTicks={renderTTSButton}
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
    return <SendButton {...props} color={robot.primary}></SendButton>;
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
        user={{_id: 11}}
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
});
