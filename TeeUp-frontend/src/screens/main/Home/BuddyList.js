import React from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40; // 좌우 여백 합계 40
const CARD_HEIGHT = 257;

export default function BuddyList({ buddies, loading }) {
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#007AFF"
        style={{ marginVertical: 20 }}
      />
    );
  }

  return (
    <FlatList
      data={buddies}
      keyExtractor={(item) => item.loginId}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          {/* 카드 */}
          <ImageBackground
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/335x257' }}
            resizeMode="cover"
            style={[styles.cardBackground, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.gradientOverlay} />

            <View style={styles.cardContent}>
              {/* Chip */}
              <View style={styles.chip}>
                <Text style={styles.chipText}>⚡️ Potential Match!</Text>
              </View>

              {/* 이름, 나이 + 태그 묶음 */}
              <View style={styles.bottomSection}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>
                    {item.nickname || '이름없음'}, {item.age || '나이도 없어~'}
                  </Text>
                  <View style={styles.nameIcon} />
                </View>

                <View style={styles.tagRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      {item.golf_level || '있는게 없노'}
                    </Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Outdoor</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Anime</Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>

          {/* 버튼 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonOutline}>
              <Text style={styles.buttonOutlineText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonFill}>
              <Text style={styles.buttonFillText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 12,
  },
  itemContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  cardBackground: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageStyle: {
    borderRadius: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22, 18, 15, 0.5)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(32, 25, 19, 0.4)',
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 19,
    color: '#FFFFFF',
  },
  bottomSection: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  nameText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nameIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#3BB5F9',
    borderRadius: 9,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 12, // 여기 gap 더 크게!
    flexWrap: 'wrap',
    marginTop: 6,  
  },
  tag: {
    backgroundColor: 'rgba(32, 25, 19, 0.4)',
    borderRadius: 40,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tagText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 16,
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
    width: CARD_WIDTH,
  },
  buttonOutline: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#EFF0F7',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOutlineText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: '#201913',
  },
  buttonFill: {
    flex: 1,
    height: 52,
    backgroundColor: '#1D7C3E',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFillText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
