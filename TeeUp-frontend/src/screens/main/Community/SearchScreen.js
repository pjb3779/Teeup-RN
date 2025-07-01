import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SearchScreen({ navigation }) {
    return (
        <>
        <View style={styles.headerMenu}>
            <Text style={styles.titleText}>Search</Text>
        </View>

        <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#999"
            />
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    headerMenu: {
        marginTop: 20,
        alignItems: 'flex-start',
        marginLeft: '5%',
    },
    titleText: {
        color: '#1D7C3E',
        fontFamily: 'SF Pro',
        fontSize: 35,
        fontWeight: '600',
        marginTop: 50,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 10,
        marginHorizontal: 16,
        marginTop: 10,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
});
