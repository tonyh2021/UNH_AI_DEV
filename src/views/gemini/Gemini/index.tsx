import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import {StyleSheet, SafeAreaView, Image, Keyboard} from 'react-native';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {fetchUserData, Robot} from '@/utils/RobotData';
import {requestGemini} from '@/http/GeminiAPI';
import appStyles from '@/utils/styleHelper';
import Header from '@/navigation/Header';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import BackButton from '@/navigation/BackButton';
import {RootStackParams} from '@/navigation/types/RootStackParams';
import {AIMessageType, UIMessage} from '@/http/type';
import SendButton from '@/views/common/SendButton';
import ToolbarActions from '@/views/common/ToolbarActions';
import DismissButton from '@/views/common/DismissButton';
import SettingsButton from '@/navigation/SettingsButton';
import {requestOpenaiTTS} from '@/http/OpenaiAPI';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';

interface Props {
  robot: Robot;
}

const Gemini = () => {
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
      headerRight: (props: HeaderBackButtonProps) => (
        <SettingsButton
          tintColor={robot.primary}
          onPress={() => {
            navigation.navigate('Settings', {robot});
          }}
        />
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

  const playbackState = usePlaybackState();
  const [loadingTTS, setLoadingTTS] = useState(false);

  const speakingIdRef = React.useRef<string | number | null>(null);

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
        role: message.user._id === robot.id ? 'model' : 'user',
        imageType: message.imageType,
        base64: message.base64,
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

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (error: any) {
      if (error && typeof error.code === 'string') {
        if (error.code !== 'player_already_initialized') {
          console.log(error.code);
        }
      } else {
        console.log(JSON.stringify(error));
      }
    }
  };

  const disposePlayer = async () => {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  };

  useEffect(() => {
    setupPlayer();
    return () => {
      disposePlayer();
    };
  }, []);

  const speakMessage = async (message: UIMessage) => {
    if (speakingIdRef.current === message._id) {
      return;
    }
    setLoadingTTS(true);
    speakingIdRef.current = message._id;
    const {data} = await requestOpenaiTTS({text: message.text});
    const track = {
      id: message._id,
      url: `file://${data.audioPath}`,
    };
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      await TrackPlayer.add([track]);
      await TrackPlayer.play();
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  useEffect(() => {
    console.log('playbackState', playbackState);
    if (!playbackState || playbackState.state === State.Ended) {
      setLoadingTTS(false);
    }
  }, [playbackState]);

  const renderBubble = (props: any) => {
    console.log('loadingTTS', loadingTTS);
    const backgroundColorLeft =
      loadingTTS === true && speakingIdRef.current === props.currentMessage._id
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
  toolBar: {
    backgroundColor: appStyles.color.background,
    borderTopColor: appStyles.color.lightGrey,
    borderTopWidth: 1,
    paddingLeft: 5,
    paddingRight: 10,
    paddingBottom: 10,
  },
});
