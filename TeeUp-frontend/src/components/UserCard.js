import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const UserCard = ({ user }) => (
  <View style={styles.card}>
    <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
    <View>
      <Text>{user.nickname}</Text>
      <Text>{user.gender}, {user.age}</Text>
      <Text>레벨: {user.golf_level}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, borderBottomWidth: 1 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 }
});

export default UserCard;
