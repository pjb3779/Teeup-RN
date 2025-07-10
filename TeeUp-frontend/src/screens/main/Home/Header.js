import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreenHeader() {
  return (
    <View style={styles.container}>
      <View style={{ width: 24 }} /> 
      {/* 왼쪽 빈 공간 (좌측 아이콘 없으므로 공간 확보) */}
      
      <Text style={styles.title}>Nice On</Text>

      <TouchableOpacity>
        <Icon name="notifications-outline" size={24} color="#201913" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 38,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '700',
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
  },
});
