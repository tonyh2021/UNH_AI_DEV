import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import {StyleSheet, SafeAreaView, Image} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {fetchUserData, Robot} from '@/utils/RobotData';
import appStyles from '@/utils/styleHelper';
import Header from '@/navigation/Header';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import BackButton from '@/navigation/BackButton';
import {RootStackParams} from '@/navigation/types/RootStackParams';
import {AIMessageType, UIMessage} from '@/http/type';
import SendButton from '@/views/common/SendButton';
import {useShallow} from 'zustand/react/shallow';
import Tts from 'react-native-tts';
import useTtsStore, {TtsStatus} from '@/views/common/useTtsStore';
import ToolbarActions from '@/views/common/ToolbarActions';
import {requestOpenai} from '@/http/OpenaiAPI';
import {Keyboard} from 'react-native';
import DismissButton from '@/views/common/DismissButton';

interface Props {
  robot: Robot;
}

const OpenAI = () => {
  const param = useRoute().params as Props;
  const robot = param.robot;

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const messagesRef = React.useRef(messages);
  const [loading, setLoading] = useState(false);

  const currentUserRef = useRef<any>();

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

    currentUserRef.current = fetchUserData();
  }, []);

  const {ttsStatus, setTtsStatus} = useTtsStore(
    useShallow(state => ({
      ttsStatus: state.ttsStatus,
      setTtsStatus: state.setTtsStatus,
    })),
  );

  const speakingIdRef = React.useRef<string | number | null>(null);

  const onStart = () => {
    setTtsStatus(TtsStatus.started);
  };

  const onFinish = () => {
    console.log('onFinish');
    setTtsStatus(TtsStatus.finished);
    speakingIdRef.current = null;
  };
  const onCancel = () => {
    console.log('onCancel');
    setTtsStatus(TtsStatus.cancelled);
    speakingIdRef.current = null;
  };
  useEffect(() => {
    Tts.setIgnoreSilentSwitch('ignore');
    Tts.getInitStatus().then(result => {});
    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    Tts.setIgnoreSilentSwitch('ignore');
    Tts.getInitStatus().then(result => {
      Tts.addEventListener('tts-start', onStart);
      Tts.addEventListener('tts-finish', onFinish);
      Tts.addEventListener('tts-cancel', onCancel);
    });
    return () => {
      Tts.stop();
      Tts.removeEventListener('tts-start', onStart);
      Tts.removeEventListener('tts-finish', onFinish);
      Tts.removeEventListener('tts-cancel', onCancel);
    };
  }, []);

  const updateMessages = (messages: UIMessage[]) => {
    setMessages(previousMessages => {
      const updatedMessages = GiftedChat.append(previousMessages, messages);
      messagesRef.current = updatedMessages;
      return updatedMessages;
    });
  };

  const renderAvatar = (props: any) => {
    if (props.currentMessage.user._id === robot.id) {
      return <Image style={styles.avatar} source={{uri: robot.image}} />;
    }
    return (
      <Image
        style={styles.avatar}
        source={{uri: currentUserRef.current.avatar}}
      />
    );
  };

  const sendImage = async (uri: string, base64?: string, type?: string) => {
    const message = {
      _id: Date.now(),
      image: uri,
      base64,
      imageType: type,
      createdAt: new Date(),
      user: currentUserRef.current,
    } as UIMessage;
    updateMessages([message]);
    messagesRef.current = [message];
    setLoading(true);

    console.log('base64 length', base64?.length);
    console.log('base64 type', type);

    fetchAPIResponse();
  };

  const onSend = useCallback((newMessages: UIMessage[]) => {
    Keyboard.dismiss();
    updateMessages(newMessages);
    setLoading(true);
    if (newMessages[0]?.text) {
      fetchAPIResponse();
    }
  }, []);

  const sendMessage = (text?: string) => {
    if (!text) {
      return;
    }
    const message = {
      _id: Date.now(),
      text,
      createdAt: new Date(),
      user: currentUserRef.current,
    } as UIMessage;
    updateMessages([message]);
    messagesRef.current = [message];
    setLoading(true);
    fetchAPIResponse();
  };

  const fetchAPIResponse = async () => {
    const aiMessages = [] as AIMessageType[];
    for (const message of messagesRef.current) {
      aiMessages.push({
        text: message.text,
        role: message.user._id === robot.id ? 'assistant' : 'user',
        imageType: message.imageType,
        base64: message.base64,
      });
    }

    try {
      const response = await requestOpenai({
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

  const speakMessage = (message: UIMessage) => {
    if (speakingIdRef.current === message._id) {
      return;
    }
    if (ttsStatus === TtsStatus.started) {
      Tts.stop();
    } else {
      Tts.speak(message.text);
      speakingIdRef.current = message._id;
    }
  };

  const renderBubble = (props: any) => {
    const backgroundColorLeft =
      ttsStatus === TtsStatus.started &&
      speakingIdRef.current === props.currentMessage._id
        ? robot.primary + '4D'
        : appStyles.color.lightGrey;
    console.log('message', props.currentMessage);
    return (
      <Bubble
        {...props}
        position={props.currentMessage.user._id === robot.id ? 'left' : 'right'}
        onLongPress={() => {}}
        onPress={() => {
          speakMessage(props.currentMessage);
        }}
        wrapperStyle={{
          right: {
            backgroundColor: robot.primary + 'CC',
          },
          left: {
            backgroundColor: backgroundColorLeft,
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
      <SendButton
        {...props}
        color={robot.primary}
        disabled={loading}></SendButton>
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: appStyles.color.background,
        }}
        textInputStyle={{
          color: appStyles.color.primary,
          backgroundColor: 'white',
          paddingHorizontal: 10,
          borderRadius: 4,
        }}
        renderActions={() => {
          return (
            <ToolbarActions
              color={robot.primary}
              onPickImage={({uri, fileSize, base64, type}) => {
                console.log('onPick', uri, fileSize);
                if (uri) {
                  sendImage(uri, base64, type);
                }
              }}
              onRecognize={text => {
                sendMessage(text);
                console.log('recognizeCallback', text);
              }}></ToolbarActions>
          );
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
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderAvatar={renderAvatar}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        user={currentUserRef.current}
        alwaysShowSend
        placeholder="Type your message..."
        timeTextStyle={{
          right: {color: appStyles.color.background},
          left: {color: appStyles.color.secondary},
        }}
        shouldUpdateMessage={(props, nextProps) => {
          return true;
        }}
      />
      <DismissButton />
    </SafeAreaView>
  );
};

export default OpenAI;

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
  toolBar: {
    backgroundColor: appStyles.color.background,
    borderTopColor: appStyles.color.lightGrey,
    borderTopWidth: 1,
    paddingLeft: 5,
    paddingRight: 10,
    paddingBottom: 10,
  },
});
