// components/BuddyList.js
import React from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';

export default function BuddyList({ buddies, loading }) {
  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />;
  }

  return (
    <FlatList
      data={buddies}
      keyExtractor={(item) => item.loginId}
      renderItem={({ item }) => (
        <View style={{
          backgroundColor: '#f2f2f2',
          borderRadius: 12,
          padding: 16,
          minWidth: 120,
          alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {item.nickname || '이름없음'}
          </Text>
          <Text style={{ fontSize: 14, color: 'gray', marginTop: 4 }}>
            {item.golf_level || '레벨정보없음'}
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
