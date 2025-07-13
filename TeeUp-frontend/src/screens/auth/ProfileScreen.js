import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { updateProfile } from '../../services/authService';

export default function ProfileScreen({ navigation, route }) {
  const loginId = route.params?.loginId;

  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [handicap, setHandicap] = useState('');
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('');

  const handleContinue = async () => {
    const profileData = {
      nickname: username,
      gender,
      age: parseInt(age) || 0,
      golfLevel: handicap,
      // purpose,
      // area: location,
    };

    try {
      const result = await updateProfile(profileData, loginId);
      console.log('프로필 업데이트 완료:', result);
      navigation.navigate('Login');
    } catch (e) {
      console.error('프로필 업데이트 실패:', e.message);
      alert(e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Setting your profile to get started
        </Text>
      </View>

      <InputField
        label="User name"
        placeholder="ex) Your name"
        value={username}
        onChangeText={setUsername}
        borderGreen
      />

      <InputField
        label="Gender"
        placeholder="ex) Male / Female"
        value={gender}
        onChangeText={setGender}
      />

      <InputField
        label="Age"
        placeholder="ex) 20010414"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <InputField
        label="Golf handicap"
        placeholder="ex) 12"
        keyboardType="numeric"
        value={handicap}
        onChangeText={setHandicap}
      />

      <InputField
        label="Purpose"
        placeholder="ex) To play more golf"
        value={purpose}
        onChangeText={setPurpose}
      />

      <InputField
        label="Location"
        placeholder="ex) Beijing"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  borderGreen,
}) {
  return (
    <View style={styles.inputFieldContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[
          styles.inputBox,
          borderGreen && styles.inputBoxGreenBorder,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#8F9098"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.005 * 16,
    color: '#1F2024',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.01 * 12,
    color: '#71727A',
  },
  inputFieldContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 15,
    color: '#2F3036',
    marginBottom: 8,
  },
  inputBox: {
    height: 48,
    width: '100%',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C5C6CC',
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#1F2024',
  },
  inputBoxGreenBorder: {
    borderWidth: 1.5,
    borderColor: '#1D7C3E',
  },
  button: {
    marginTop: 24,
    height: 48,
    width: 327,
    backgroundColor: '#1D7C3E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 15,
    color: '#FFFFFF',
  },
});
