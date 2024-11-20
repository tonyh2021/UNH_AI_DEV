/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import createScaledStyle from '@/utils/createScaledStyle';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {MainNavigator} from '@/navigation/MainNavigator';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.gestureWrap}>
      <SafeAreaProvider>
        <MainNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = createScaledStyle({
  gestureWrap: {
    flex: 1,
  },
});
