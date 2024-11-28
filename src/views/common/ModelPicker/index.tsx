import appStyles from '@/utils/styleHelper';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, Modal} from 'react-native';
import {Picker} from '@react-native-picker/picker';

interface Props {
  color?: string; // Optional property to allow customization of button color
  onPress?: () => void; // Optional property for button press callback
}

const ModelPicker = (props: Props) => {
  const [visible, setVisible] = React.useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState();

  const renderPicker = () => {
    return (
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedLanguage(itemValue)
        }>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    );
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={async () => {
        setVisible(true);
      }}>
      <Modal animationType="fade" transparent={true} visible={visible}>
        {renderPicker()}
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
  },
  button: {
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
  text: {
    fontSize: 19,
    color: appStyles.color.background,
    fontWeight: 'bold',
  },
});

export default ModelPicker;
