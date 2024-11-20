import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '@/views/home';
import EmptyScreen from '@/views/demo/EmptyScreen';

const Stack = createNativeStackNavigator();

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
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="EditPost" component={EmptyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
