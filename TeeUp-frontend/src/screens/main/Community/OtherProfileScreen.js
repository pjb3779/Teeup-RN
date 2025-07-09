import React, { useState } from 'react';
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
  const { loginId, nickName, avatarUrl } = route.params;

  // ✅ 여기 수정!
  const [tab, setTab] = useState('posts');

  return (
    <SafeAreaView style={styles.container}>

      {/* 상단 네비게이션 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={"#000"}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.openDrawer?.()}>
          <Icon name="more-vert" size={24} color={"#000"}/>
        </TouchableOpacity>
      </View>

      {/* 프로필 헤더 */}
      <View style={styles.profileHeader}>
        <View style={{flex: 1}}>
          <Text style={styles.userNickname}>{nickName}</Text>
          <Text style={styles.userLoginId}>{loginId}</Text>
        </View>
      </View> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  userNickname: {
    fontWeight: "700",
    lineHeight: 28,
    fontSize: 26,
  },
  userLoginId: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28
  },
});
