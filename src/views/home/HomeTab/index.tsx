import * as React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EmptyScreen from '@/views/demo/EmptyScreen';
import DemoView from '@/views/demo/DemoView';

const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Demo" component={DemoView} />
      <Tab.Screen name="Empty" component={EmptyScreen} />
    </Tab.Navigator>
  );
};

export default HomeTab;
