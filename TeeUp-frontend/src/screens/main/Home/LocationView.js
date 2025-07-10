import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function LocationView({ location, loading }) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.roundedRect}>
        <Icon
          name="location-on"
          size={16} // 살짝 키움
          color="#000000"
          style={styles.icon}
        />
        <Text style={styles.text}>
          {location
            ? `${location.state || ''} ${location.city || ''}`
            : '위치 정보 없음'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 12, // 원하는 만큼 위아래 간격 조절
  },
  roundedRect: {
    width: 160,           // ← 폭을 넓혔다 (기존 126 → 160)
    height: 28,           // ← 높이를 키웠다 (기존 21 → 28)
    backgroundColor: '#F8F8F8',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: '#000000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
