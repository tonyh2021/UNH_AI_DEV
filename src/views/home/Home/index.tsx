import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {Robot, RobotData} from '@/utils/RobotData';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import appStyles from '@/utils/styleHelper';
import {RootStackParams} from '@/navigation/types/RootStackParams';

const Home = () => {
  const [selectedRobot, setSelectedRobot] = useState<Robot>(RobotData[0]);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const renderRobotAvatar = (item: Robot) => {
    return (
      <TouchableOpacity
        style={styles.avatar}
        key={item.id}
        onPress={() => setSelectedRobot(item)}>
        <Image
          source={item.image}
          style={[styles.avatarImage, {borderColor: item.primary}]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, {color: selectedRobot.primary}]}>
            Hello, I am {selectedRobot.name}
          </Text>
          <Image source={selectedRobot.image} style={styles.mainImage} />
          <Text style={[styles.subtitle, {color: selectedRobot.primary}]}>
            How can I help you?
          </Text>
        </View>

        <View style={styles.robotsWrap}>
          <FlatList
            data={RobotData}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => renderRobotAvatar(item)}
            keyExtractor={item => item.id}
          />
        </View>

        <Text style={styles.hint}>{'Choose your AI companion'}</Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(selectedRobot.target as any, {
              id: selectedRobot.id,
            })
          }
          style={[styles.chatButton, {backgroundColor: selectedRobot.primary}]}>
          <Text style={styles.buttonText}>Let's chat</Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    width: '100%',
  },
  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 25,
    marginTop: 20,
  },
  mainImage: {
    marginTop: 20,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: appStyles.color.lightGrey,
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
    borderWidth: 2,
  },
  robotsWrap: {
    marginTop: 20,
    alignItems: 'center',
    height: 95,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: appStyles.color.lightGrey,
  },
  hint: {
    marginTop: 5,
    fontSize: 16,
    color: appStyles.color.secondary,
  },
  chatButton: {
    padding: 17,
    width: 250,
    borderRadius: 19,
    alignItems: 'center',
    marginTop: 30,
    elevation: 5,
    shadowColor: appStyles.color.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 19,
    color: appStyles.color.background,
    fontWeight: 'bold',
  },
});

export default Home;
