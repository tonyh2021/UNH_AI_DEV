import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Robot, RobotData} from '@/utils/RobotData';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import appStyles from '@/utils/styleHelper';
import {RootStackParams} from '@/navigation/types/RootStackParams';
import BreathingButton from '@/views/common/BreathingButton';
import MainAvatar from '@/views/common/MainAvatar';

const Home = () => {
  const [selectedRobot, setSelectedRobot] = useState<Robot>(RobotData[0]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const renderRobotAvatar = (item: Robot) => {
    const selected = item.id === selectedRobot.id;
    return (
      <TouchableOpacity
        style={styles.avatar}
        key={item.id}
        onPress={() => setSelectedRobot(item)}>
        <Image
          source={{uri: item.image}}
          style={[
            styles.avatarImage,
            {
              borderWidth: selected ? 2 : 0,
              borderColor: item.primary,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MainAvatar robot={selectedRobot}></MainAvatar>

        <Text style={styles.hint}>{'Choose your AI companion'}</Text>
        <View style={styles.robotsWrap}>
          <FlatList
            data={RobotData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => renderRobotAvatar(item)}
            keyExtractor={item => item.id}
          />
        </View>

        <BreathingButton
          color={selectedRobot.primary}
          onPress={() => {
            if (selectedRobot.id === '10') {
              navigation.navigate('OpenAI', {robot: selectedRobot});
            } else if (selectedRobot.id === '20') {
              navigation.navigate('Gemini', {robot: selectedRobot});
            }
          }}></BreathingButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyles.color.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    margin: 10,
    borderRadius: 25,
  },
  hint: {
    marginTop: 20,
    fontSize: 16,
    color: appStyles.color.secondary,
  },
  robotsWrap: {
    marginTop: 5,
    alignItems: 'center',
    height: 95,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: appStyles.color.lightGrey,
  },
});

export default Home;
