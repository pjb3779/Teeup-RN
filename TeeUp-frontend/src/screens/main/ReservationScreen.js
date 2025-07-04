import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Reservation() {
    return (
    <>
        <View style={styles.headerMenu}>
            <Text style={styles.titleText}> My Reservations </Text>
        </View>

        <View style={styles.container}>
        <Text style={styles.text}>예약 페이지입니다.</Text>
        </View>
    </>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },


  headerMenu: {
    marginTop: 20,
    alignItems: 'center'
  },
  titleText: {
    fontSize: 20,
    marginTop: 50,
  }
});