import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Chatting() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>채팅 페이지입니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerMenu: {
    marginTop: 20,
    alignItems: 'center',
  },
  titleText: {
    color: '#1D7C3E',
    fontFamily: 'SF Pro',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 50,
  },
});
