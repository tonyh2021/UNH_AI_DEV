import * as React from 'react';
import {View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RNIntro from '@/views/demo/RNIntro';
import OpenAIList from '@/views/openai/OpenAIList';
import appStyles from '@/utils/styleHelper';
import Icon from 'react-native-remix-icon';

const Tab = createBottomTabNavigator();

const HomeTab = () => {
  type TabScreen = {
    name: string;
    icon: string;
    iconFocused: string;
    tabName: string;
  };

  const tabScreens = [
    {
      name: 'OpenAI',
      icon: 'ri-chat-voice-ai-line',
      iconFocused: 'ri-chat-voice-ai-fill',
      tabName: 'OpenAI',
    },
    {
      name: 'React Native',
      icon: 'ri-reactjs-fill',
      iconFocused: 'ri-reactjs-line',
      tabName: 'React Native',
    },
  ] as TabScreen[];

  const getTabIcon = (iconName: string, focused: boolean) => {};

  const getTabLabel = (tabName: string, focused: boolean) => {
    const fontWeight = focused
      ? appStyles.fontWeight.semiBold
      : appStyles.fontWeight.regular;
    const color = focused ? appStyles.color.primary : appStyles.color.secondary;
    return <Text style={{color, fontWeight}}>{tabName}</Text>;
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          const tabScreen = tabScreens.find(item => item.name === route.name);
          const color = focused
            ? appStyles.color.primary
            : appStyles.color.secondary;
          if (!tabScreen) {
            return <></>;
          }
          const iconName = focused ? tabScreen.iconFocused : tabScreen.icon;
          return (
            <View style={{paddingTop: 8, paddingBottom: 4}}>
              <Icon name={iconName as any} size="24" color={color}></Icon>
            </View>
          );
        },
        tabBarLabel: ({focused}) => {
          const tabScreen = tabScreens.find(item => item.name === route.name);
          const tabName: string = tabScreen ? tabScreen.tabName : '';
          return getTabLabel(tabName, focused);
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: appStyles.color.background,
        },
      })}>
      <Tab.Screen name="OpenAI" component={OpenAIList} />
      <Tab.Screen
        name="React Native"
        options={{headerShown: true}}
        component={RNIntro}
      />
    </Tab.Navigator>
  );
};

export default HomeTab;
