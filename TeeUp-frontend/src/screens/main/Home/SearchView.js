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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { searchBuddiesSimple, searchBuddiesDetail } from '../../../services/matchService';

export default function SearchView({ value, onChange, onResult }) {
  const [modalVisible, setModalVisible] = useState(false);

  // 상세 검색 state (기본값: 선택하지 않음 = '')
  const [gender, setGender] = useState('');
  const [averageStrokes, setAverageStrokes] = useState('');
  const [location, setLocation] = useState('');

  // Age: UI 표시용 디폴트는 두되, 사용자가 건드렸을 때만 필터 반영
  const [ageRange, setAgeRange] = useState([19, 29]);
  const [ageTouched, setAgeTouched] = useState(false);
  const [ageMin, ageMax] = ageRange;

  // Date: 선택 전엔 null, 피커 표시용으로만 임시 today 사용
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 로딩 상태
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleSearch = async () => {
    const keyword = value?.trim();
    if (!keyword) return;
    try {
      setIsSearching(true);
      const result = await searchBuddiesSimple(keyword);
      if (!result || result.length === 0) {
        Alert.alert('검색 결과 없음', '일치하는 사용자가 없습니다.');
        onResult?.([]);
      } else {
        onResult?.(result);
      }
    } catch (e) {
      console.error('검색 실패:', e?.message);
      Alert.alert('검색 실패', e?.message || '오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const buildFilters = () => {
    // 빈 값('')/미선택은 제외하여 전송할 필터 구성
    const keyword = value?.trim();
    const filters = {
      ...(keyword && { keyword }),
      ...(gender && { gender }),
      ...(averageStrokes && { averageStrokes }), // 서버가 숫자를 기대하면 Number(averageStrokes)
      ...(location && { location }),
      ...(ageTouched && { ageMin, ageMax }),
      ...(selectedDate && { availableDate: selectedDate.toISOString() }),
    };
    return filters;
  };

  const handleApplyFilter = async () => {
    const filters = buildFilters();
    if (Object.keys(filters).length === 0) {
      Alert.alert('조건 없음', '검색어 또는 상세 조건을 하나 이상 선택해 주세요.');
      return;
    }

    try {
      setIsFiltering(true);
      console.log('적용된 상세검색 값(서버로 보낼 payload):', filters);

      const result = await searchBuddiesDetail(filters);
      if (!result || result.length === 0) {
        Alert.alert('검색 결과 없음', '일치하는 사용자가 없습니다.');
        onResult?.([]);
      } else {
        onResult?.(result);
      }
      setModalVisible(false);
    } catch (e) {
      console.error('상세검색 실패:', e?.message);
      Alert.alert('상세검색 실패', e?.message || '오류가 발생했습니다.');
    } finally {
      setIsFiltering(false);
    }
  };

  const handleClearAll = () => {
    setGender('');
    setAverageStrokes('');
    setLocation('');
    setAgeRange([19, 29]);
    setAgeTouched(false);
    setSelectedDate(null);
  };

  return (
    <>
      <View style={styles.wrapper}>
        {/* 검색창 */}
        <View style={styles.searchBox}>
          <TouchableOpacity onPress={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <ActivityIndicator size="small" />
            ) : (
              <Icon name="search" size={24} color="#979491" />
            )}
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
          onPress={() => {
            Keyboard.dismiss();
            setModalVisible(true);
          }}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
                <Text style={styles.clearAllText}>전체 초기화</Text>
              </TouchableOpacity>
              <View style={{ width: 8 }} />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#201913" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* Gender */}
            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="선택하지 않음" value="" />  {/* 성별 백엔드랑 맞추기 */}
                <Picker.Item label="남" value="남" />
                <Picker.Item label="여" value="여" />
                <Picker.Item label="기타" value="기타" />
              </Picker>
            </View>

            {/* Age Preference */}
            <Text style={styles.sectionTitle}>
              Age Preference ({ageTouched ? `${ageMin} - ${ageMax}` : '선택하지 않음'})
            </Text>
            <View style={styles.ageRow}>
              <MultiSlider
                values={ageRange}
                sliderLength={250}
                onValuesChange={(values) => setAgeRange(values)}
                onValuesChangeFinish={() => setAgeTouched(true)}
                min={10}
                max={70}
                step={1}
                selectedStyle={{ backgroundColor: '#1D7C3E' }}
                markerStyle={{ backgroundColor: '#1D7C3E' }}
              />
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setAgeRange([19, 29]);
                  setAgeTouched(false);
                }}
              >
                <Text style={styles.resetButtonText}>리셋</Text>
              </TouchableOpacity>
            </View>

            {/* Average Strokes */}
            <Text style={styles.sectionTitle}>Average Strokes</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={averageStrokes}
                onValueChange={(v) => setAverageStrokes(v)}
              >
                <Picker.Item label="선택하지 않음" value="" />
                <Picker.Item label="Under 100" value="100" />
                <Picker.Item label="Under 90" value="90" />
                <Picker.Item label="Under 80" value="80" />
              </Picker>
            </View>

            {/* Location */}
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationBox}>
              <Text>{location || '선택하지 않음'}</Text>
              <TouchableOpacity
                onPress={() => {
                  // TODO: 위치 선택 UI 연결 (예: 모달/검색 화면)
                  // setLocation('Seoul'); 와 같은 식으로 설정
                  Alert.alert('안내', '위치 선택 UI를 연결해 주세요.');
                }}
              >
                <Icon name="place" size={20} color="#1D7C3E" />
              </TouchableOpacity>
            </View>

            {/* Available Dates */}
            <Text style={styles.sectionTitle}>Available Dates</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerBox}
            >
              <Text>
                {selectedDate ? selectedDate.toDateString() : '선택하지 않음'}
              </Text>
              <Icon name="calendar-today" size={20} color="#1D7C3E" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate ?? new Date()}
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
            style={[styles.applyButton, isFiltering && { opacity: 0.7 }]}
            onPress={handleApplyFilter}
            disabled={isFiltering}
          >
            {isFiltering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.applyButtonText}>Apply Result</Text>
            )}
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
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resetButton: {
    marginLeft: 8,
    backgroundColor: '#EFEFEF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 12,
    color: '#1D7C3E',
    fontWeight: '600',
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
  clearAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F1F1F1',
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#201913',
  },
});
