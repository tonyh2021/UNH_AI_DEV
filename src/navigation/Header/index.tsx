import appStyles from '@/utils/styleHelper';
import {Image, StyleSheet, Text, View} from 'react-native';

interface Props {
  avatar: string;
  name: string;
  color?: string;
}

const Header = (props: Props) => {
  const {avatar, name, color} = props;
  return (
    <View style={styles.wrap}>
      <Image source={{uri: avatar}} style={styles.avatar} />
      <Text style={{...styles.title, color}}>{name}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: appStyles.color.primary,
  },
});
