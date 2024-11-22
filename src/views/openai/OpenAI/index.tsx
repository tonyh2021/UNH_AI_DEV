import * as React from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RootStackParams} from '@/navigation/types/RootStackParams';

const OpenAI = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MessageDemo');
        }}>
        <Text>{'press'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OpenAI;
