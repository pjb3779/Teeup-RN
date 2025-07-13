import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  Modal,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { searchBuddiesSimple } from '../../../services/matchService';

export default function SearchView({ value, onChange, onResult }) {
  const [modalVisible, setModalVisible] = useState(false);

  // 상세 검색 state
  const [gender, setGender] = useState('Female');
  const [ageRange, setAgeRange] = useState([19, 29]);
  const [location, setLocation] = useState('Daegu, Korea');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSearch = async () => {
    if (!value || value.trim() === '') return;

    try {
      const result = await searchBuddiesSimple(value);
      console.log('검색 결과:', result);

      if (!result || result.length === 0) {
        Alert.alert('검색 결과 없음', '일치하는 사용자가 없습니다.');
        onResult?.([]);
      } else {
        onResult?.(result);
      }
    } catch (e) {
      console.error('검색 실패:', e.message);
      Alert.alert('검색 실패', e.message || '오류가 발생했습니다.');
    }
  };

  const handleApplyFilter = () => {
    console.log('적용된 상세검색 값:', {
      gender,
      ageMin,
      ageMax,
      location,
      selectedDate,
    });
    // 여기서 검색 API 호출 가능
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.wrapper}>
        {/* 검색창 */}
        <View style={styles.searchBox}>
          <TouchableOpacity onPress={handleSearch}>
            <Icon name="search" size={24} color="#979491" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Search for a friend or partners"
            placeholderTextColor="#979491"
            value={value}
            onChangeText={onChange}
            onSubmitEditing={() => {
              handleSearch();
              Keyboard.dismiss();
            }}
            returnKeyType="search"
          />
        </View>

        {/* setting 아이콘 */}
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="settings" size={24} color="#201913" />
        </TouchableOpacity>
      </View>

      {/* 상세 검색 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#201913" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* Gender */}
            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Age Preference */}
            <Text style={styles.sectionTitle}>
              Age Preference ({ageRange[0]} - {ageRange[1]})
            </Text>
            <View style={{ marginBottom: 20 }}>
              <MultiSlider
                values={ageRange}
                sliderLength={300}
                onValuesChange={(values) => setAgeRange(values)}
                min={10}
                max={70}
                step={1}
                selectedStyle={{ backgroundColor: '#1D7C3E' }}
                markerStyle={{ backgroundColor: '#1D7C3E' }}
              />
            </View>

            {/* Average Srokes */}
            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.pickerBox}>
              <Picker
                // selectedValue={Average_Srokes}
                // onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Under 100" value="100" />
                <Picker.Item label="Under 90" value="90" />
                <Picker.Item label="Under 80" value="80" />
              </Picker>
            </View>

            {/* Location */}
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationBox}>
              <Text>{location}</Text>
              <Icon name="place" size={20} color="#1D7C3E" />
            </View>

            {/* Available Dates */}
            <Text style={styles.sectionTitle}>Available Dates</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerBox}
            >
              <Text>{selectedDate.toDateString()}</Text>
              <Icon name="calendar-today" size={20} color="#1D7C3E" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilter}
          >
            <Text style={styles.applyButtonText}>Apply Result</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
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
    height: 40,
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
    marginLeft: 5,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#201913',
  },
  modalContent: {
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 10,
    color: '#201913',
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#EFF0F7',
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EFF0F7',
    borderRadius: 40,
    padding: 16,
    marginBottom: 12,
  },
  datePickerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EFF0F7',
    borderRadius: 40,
    padding: 16,
    marginBottom: 12,
  },
  applyButton: {
    backgroundColor: '#1D7C3E',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
