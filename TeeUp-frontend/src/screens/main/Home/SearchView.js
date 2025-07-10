import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SearchView({ value, onChange }) {
  return (
    <View style={styles.wrapper}>
      {/* 검색창 */}
      <View style={styles.searchBox}>
        <Icon
          name="search"
          size={24}
          color="#979491"
        />
        <TextInput
          style={styles.input}
          placeholder="Search for a friend or partners"
          placeholderTextColor="#979491"
          value={value}
          onChangeText={onChange}
        />
      </View>

      {/* setting 아이콘 */}
      <TouchableOpacity style={styles.settingButton}>
        <Icon
          name="settings"
          size={24}
          color="#201913"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 335,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  searchBox: {
    width: 306,
    height: 35,
    backgroundColor: '#F8F8F8',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
    color: '#201913',
  },
  settingButton: {
    marginLeft: 5,       // 간격 조절
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
