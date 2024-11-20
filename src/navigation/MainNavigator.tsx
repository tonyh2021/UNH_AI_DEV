import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTab from '@/views/home/HomeTab';
import EmptyScreen from '@/views/demo/EmptyScreen';
import {RootStackParams} from '@/navigation/types/RootStackParams';
import DemoView from '@/views/demo/DemoView';

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
        <Stack.Screen name="EmptyScreen" component={EmptyScreen} />
        <Stack.Screen name="DemoView" component={DemoView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
