import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParams} from '@/navigation/types/RootStackParams';
import HomeTab from '@/views/home/HomeTab';
import EmptyPage from '@/views/demo/EmptyPage';
import RNIntro from '@/views/demo/RNIntro';

const Stack = createNativeStackNavigator<RootStackParams>();

export const MainNavigator = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white', // 设置背景颜色
    },
  };

  return (
    <NavigationContainer
      onReady={() => {
        console.log('onReady');
      }}
      onStateChange={() => {
        console.log('onStateChange');
      }}
      theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTab"
          component={HomeTab}
          options={{headerShown: false}}
        />
        <Stack.Screen name="EmptyPage" component={EmptyPage} />
        <Stack.Screen name="RNIntro" component={RNIntro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
