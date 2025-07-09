import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000); // 3000ms = 3초

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        {/* 상단: 로고 + 환영문구 */}
        <View style={styles.top}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Find Your Golf Mate</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '85%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'flex-end',
  },
  top: {
    alignItems: 'center',
  },
  logo: {
    width: 174,
    height: 174,
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#6E7787',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 200,
  },
});