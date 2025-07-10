import React from 'react';
import { Text, ActivityIndicator } from 'react-native';

export default function LocationView({ location, loading }) {
  if (loading) {
    return <ActivityIndicator size="small" color="#007AFF" />;
  }

  return (
    <Text style={{ fontSize: 16 }}>
      {location
        ? `${location.state || ''} ${location.city || ''}`
        : '위치 정보 없음'}
    </Text>
  );
}