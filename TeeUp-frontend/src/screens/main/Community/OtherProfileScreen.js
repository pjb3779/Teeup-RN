import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function OtherProfileScreen({ navigation, route }) {
  const { loginId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="public" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 2. 본문 예시 */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>OtherProfileScreen</Text>
        <Text style={styles.subTitle}>User Login ID: {loginId}</Text>

        {/* 예시로 이미지 넣어보기 */}
        <Image
          source={{
            uri: 'https://placekitten.com/200/200',
          }}
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  content: {
    padding: 16,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },

  subTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    backgroundColor: '#ddd',
  },

  button: {
    backgroundColor: '#1D7C3E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
