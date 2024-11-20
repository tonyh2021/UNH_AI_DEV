import * as React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EmptyScreen from '@/views/demo/EmptyScreen';
import DemoView from '@/views/demo/DemoView';

const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={DemoView} />
      <Tab.Screen name="Settings" component={EmptyScreen} />
    </Tab.Navigator>
  );
};

export default Home;
