import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CommunityScreen({navigation}) {
  return (
    <>
      <View style={styles.headerMenu}>
        <Text style={styles.titleText}> Community </Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor="black"
            onPress={() => navigation.navigate('Search')}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={24} color="#1D7C3E" />
          </TouchableOpacity>
        </View>

        {/* edit 아이콘 */}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('NewPostScreen')}
        >
          <Icon name="edit" size={24} color="#1D7C3E" />
        </TouchableOpacity>
      </View>

    </>
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

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
  },

  searchContainer: {
    flex: 1.2,             
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D7C3E',
    borderRadius: 30,
    paddingHorizontal: 12,
    height: 40,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#1D7C3E',
    paddingVertical: 0,
  },

  iconButton: {
    marginLeft: 8,
  },

  editButton: {
    marginLeft: 12,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
