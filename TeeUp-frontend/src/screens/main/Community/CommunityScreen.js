import React, { useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import api from '../../../api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostDetailScreen from './PostDetailScreen';
import Modal from 'react-native-modal';
import { useFocusEffect } from '@react-navigation/native';

export default function CommunityScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [followeeId, setFolloweeId] = useState(null);
  const [loginId, setLoginId] = useState(null);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('loginId') 
          .then(id => {
            if(id) setLoginId(id);
          })
          .catch(console.warn);
  }, []);


  const formatTimeAgo = (isoString) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const m = Math.floor(diffMs / 60000);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
  };

  // ... 누르면 생기는 토글
  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleUnfollow = async () => {
    try {
      const loginId = await AsyncStorage.getItem('loginId');
      if (!loginId) throw new Error('로그인이 필요합니다.');

      await api.delete(`/api/follows/${followeeId}`, {
        headers: { loginId }
      });

      Alert.alert('완료', '언팔로우 되었습니다.');
      setModalVisible(false);
      loadPosts(); // 리스트 갱신
    } catch (e) {
      console.error(e);
      Alert.alert('오류', e.response?.data || e.message);
    }
  };

  const handleToggleLike = async (postId) => {
    console.log('▶️ toggleLike 호출, postId=', postId, ', length=', postId?.length);

    try{
      const loginId = await AsyncStorage.getItem('loginId');
      if (!loginId) throw new Error('로그인이 필요합니다.');

      setPosts( prev => 
          prev.map(item => {
            if(item.id != postId) return item;
            const likedNow = !item.liked;
            return{
              ...item,
              liked: likedNow,
              likesCount: item.likesCount + (likedNow ? 1 : -1)
            };
          })
      );

      await api.post(`/api/post/${postId}/like/${loginId}`);

      Alert.alert('완료', '좋아요가 정상적으로 반영되었습니다. ');
    }catch(e){
      console.error(e);
      Alert.alert('오류', e.response?.data || e.message);
      loadPosts();
    }
  }
  
  const loadPosts = async () => {
    setLoading(true);
    try {
      const authLoginId = await AsyncStorage.getItem('loginId');
      if (!authLoginId) throw new Error('로그인이 필요합니다.');

      const resp = await api.get(`/api/post/list/all`, {
        headers: { loginId: authLoginId }
      });
      console.log('▶️ 원본 posts:', resp.data.data);
      let data = resp.data.data.map(p => ({ 
        ...p,
        id: p.id ?? p._id?.$oid ?? p._id,
        liked: false    // 좋아요 flag 여부
      }));

      // 랜덤 섞기 (기존 로직)
      for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }

      setPosts(data);

      // 스크롤 최상단으로
      if (listRef.current) {
        listRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    } catch (e) {
      console.error(e);
      Alert.alert('오류', e.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <>
      <View style={styles.headerMenu}>
        <Text style={styles.titleText}> Community </Text>
      </View>
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#186533ff"
            onFocus={() => navigation.navigate('Search')}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={24} color="#1D7C3E" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('NewPostScreen')}
        >
          <Icon name="edit" size={24} color="#1D7C3E" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef} 
        data={posts}
        keyExtractor={(item, idx) => item.id ?? idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('PostDetailScreen', { postId: item.id })}
            style={styles.cardTouchable}
          >
            <View style={styles.postCard}>

              {/* 카드 헤더 */}
              <View style={styles.cardHeader}>
                <View style={styles.authorInfo}>
                  <Image
                    source={{ uri: item.authorAvatarUrl }}
                    style={styles.avatar}
                  />
                  <View style={styles.authorText}>
                    <Text style={styles.authorName}>{item.authorId}</Text>
                  </View>
                </View>

                {/* ... 아이콘 */}
                <View style={styles.rightMeta}>
                  <Text style={styles.timestamp}>{formatTimeAgo(item.createdAt)}</Text>

                  <TouchableOpacity onPress={() => {
                    setFolloweeId(item.authorId);
                    toggleModal();
                  }}> 
                    <Icon name="more-horiz" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 제목 */}
              <Text style={styles.postTitle}>{item.title}</Text>

              {/* 본문 */}
              <Text style={styles.postContent}>{item.content}</Text>

              {/* 아이콘 한 줄 */}
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleToggleLike(item.id)}
                >
                  <Icon
                    name="favorite"
                    size={20}
                    color={item.liked ? 'green' : 'gray'}
                  />
                  <Text style={styles.iconText}>{item.likesCount}</Text>
                </TouchableOpacity>


                <Icon
                  name="chat-bubble-outline"
                  size={20}
                  color="gray"
                  style={styles.iconSpacer}
                />
                <Text style={styles.iconText}>{item.commentsCount}</Text>

                <Icon
                  name="repeat"
                  size={20}
                  color="gray"
                  style={styles.iconSpacer}
                />

                <Icon
                  name="send"
                  size={20}
                  color="gray"
                  style={styles.iconSpacer}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <TouchableOpacity style={styles.modalItem}>
            <Text style={styles.modalText}>Repost</Text>
            <Icon name="repeat" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem}>
            <Text style={styles.modalText}>Quote</Text>
            <Icon name="chat-bubble-outline" size={20} />
          </TouchableOpacity>

          {/* 본인의 포스트인 경우, 팔로우 취소 버튼 삭제 */}
          {followeeId !== loginId && (
            <TouchableOpacity style={styles.modalItem} onPress={handleUnfollow}>
              <Text style={styles.modalText}>Unfollow</Text>
              <Icon name="person-remove" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
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
    fontSize: 30,
    fontWeight: '800', 
    marginTop: '3%'
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
    borderWidth: 2.5,
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
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,   // 제목과 내용 사이 약간 간격
  },

  postContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,   // 내용과 아이콘 사이 간격
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#333',
  },
  iconSpacer: {
    marginLeft: 16,   // 아이콘 사이 간격
  },
  cardTouchable: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorText: {
    marginLeft: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  rightMeta: {
  flexDirection: 'row',
  alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#f6f6f6',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  likeButton: {
    flexDirection: "row",
    alignItems: 'center'
  }
});
