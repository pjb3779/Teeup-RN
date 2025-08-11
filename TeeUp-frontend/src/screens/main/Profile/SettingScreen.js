import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const sections = [
  {
    title: 'Account',
    data: [
      { icon: 'person-outline',       label: 'Edit profile',      screen: 'EditProfileScreen' },
      { icon: 'shield',       label: 'Security' },
      { icon: 'notifications-none',   label: 'Notifications' },
      { icon: 'lock-outline',         label: 'Privacy' },
    ],
  },
  {
    title: 'Support & About',
    data: [
      { icon: 'credit-card',    label: 'My Subscription' },
      { icon: 'help-outline',   label: 'Help & Support' },
      { icon: 'info-outline',   label: 'Terms and Policies' },
    ],
  },
  {
    title: 'Cache & cellular',
    data: [
      { icon: 'delete-outline', label: 'Free up space' },
      { icon: 'data-saver-on',  label: 'Data Saver' },
    ],
  },
  {
    title: 'Actions',
    data: [
      { icon: 'flag',   label: 'Report a problem' },
      { icon: 'person-add',     label: 'Add account' },
      { icon: 'exit-to-app',    label: 'Log out' },
    ],
  },
];


export default function SettingScreen({ navigation, route }) {
  const { profile } = route.params || {};

  const onPressItem = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen, { profile });
    } else {
      console.log(item.label, 'pressed');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back-ios" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.data.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.row}
                  onPress={() => onPressItem(item)}
                >
                  <Icon name={item.icon} size={24} style={styles.icon} />
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fcfbf7',      // 전체 배경
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: STATUS_BAR_HEIGHT,
    height: STATUS_BAR_HEIGHT + 80,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36,39,96,0.05)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'relative',
  },
  backButton: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    position: 'absolute',
    left: 0,
    right: 0,
    marginTop: '12%',
    textAlign: 'center',
  },
  container: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(36,39,96,0.05)',  // Figma #2427600D
    borderRadius: 6,                         // Figma 6px
    paddingVertical: 8,
    // iOS 그림자
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    color: '#b8b8b8',  // subtle icon
    marginRight: 16,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});