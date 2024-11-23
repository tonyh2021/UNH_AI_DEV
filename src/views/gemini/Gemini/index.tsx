import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Message,
  IMessage,
} from 'react-native-gifted-chat';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Robot} from '@/utils/RobotData';
import Icon from 'react-native-remix-icon';
import {requestGemini} from '@/http/GeminiAPI';

interface Props {
  robot: Robot;
}

const Gemini = () => {
  const param = useRoute().params as Props;
  const robot = param.robot;

  const navigation = useNavigation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const robotUser = {
    _id: robot.id,
    name: robot.name,
    avatar: robot.image,
  };

  useEffect(() => {
    const message = {
      _id: 0,
      text: `Hello, I am ${robot.name}`,
      createdAt: new Date(),
      user: robotUser,
    };
    setMessages([message]);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        {/* <Ionicons name="arrow-back" size={24} color="#000" /> */}
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Image source={{uri: robot.image}} style={styles.headerAvatar} />
        <Text style={styles.headerTitle}>{robot.name}</Text>
      </View>
      <View style={styles.placeholder} />
    </View>
  );

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
            backgroundColor: '#f0f0f0',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#000',
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
          backgroundColor: '#fff',
          borderTopColor: '#E8E8E8',
          borderTopWidth: 1,
        }}
        textInputStyle={{
          color: '#000',
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
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
          right: {color: '#fff'},
          left: {color: '#666'},
        }}
      />
    </SafeAreaView>
  );
};

export default Gemini;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  backButton: {
    padding: 10,
  },
  placeholder: {
    width: 44, // Same width as backButton for symmetry
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
  },
});
