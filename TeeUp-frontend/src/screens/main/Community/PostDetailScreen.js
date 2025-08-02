import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import api from '../../../api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

export default function PostDetailScreen({ route, navigation }) {
    const { postId } = route.params;

    const [postDetail, setPostDetail] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newComment, setNewComment] = useState('');
    const [postingComment, setPostingComment] = useState(false);
    const [myAvatarUrl, setMyAvatarUrl] = useState(null);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const toggleModal = (commentId = null) => {
        setSelectedCommentId(commentId);
        setModalVisible(!isModalVisible);
    };
    useEffect(() => {
        const loadData = async () => {
        setLoading(true);
        try {
            const loginId = await AsyncStorage.getItem('loginId');
            if (!loginId) throw new Error('로그인 정보가 없습니다.');

            // 게시글, 댓글, 내 프로필 동시 호출
            const [postRes, commentsRes, profileRes] = await Promise.all([
            api.get(`/api/post/${postId}`,    { headers: { loginId } }),
            api.get(`/api/post/${postId}/comments`, { headers: { loginId } }),
            api.get(`/api/profile`,           { headers: { loginId } }),
            ]);

            setPostDetail(postRes.data.data);
            setComments(commentsRes.data);
            setMyAvatarUrl(profileRes.data.avatarUrl);
        } catch (e) {
            console.error('API 호출 에러', e);
            Alert.alert(
            e.response ? '서버 오류' : '오류',
            e.response ? JSON.stringify(e.response.data) : e.message
            );
        } finally {
            setLoading(false);
        }
        };
        loadData();
    }, [postId]);

    const handleSendComment = async () => {
        const content = newComment.trim();
        if (!content) return;

        setPostingComment(true);
        try {
            const loginId = await AsyncStorage.getItem('loginId');
            if (!loginId) throw new Error('로그인이 필요합니다.');

            const res = await api.post(
            `/api/post/${postId}/comments`,
            {
                authorId: loginId,
                content,
                parentId: null,
            },
            { headers: { loginId } }
            );


        setComments(prev => [...prev, res.data]);
            setNewComment('');
            } catch (e) {
            console.error('댓글 전송 실패', e);
            Alert.alert(
                e.response ? '서버 오류' : '오류',
                e.response ? JSON.stringify(e.response.data) : e.message
            );
            } finally {
            setPostingComment(false);
        }
    };


    if (loading) {
        return (
        <View style={styles.loader}>
            <ActivityIndicator size="large" />
        </View>
        );
    }
    if (!postDetail) {
        return (
        <View style={styles.loader}>
            <Text>포스트를 불러올 수 없습니다.</Text>
        </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
                name="arrow-back-ios"
                size={24}
                style={{ marginLeft: '3.5%' }}
            />
            </TouchableOpacity>
        </View>

        {/* 본문 + 댓글 */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>{postDetail.title}</Text>
            <Text style={styles.content}>{postDetail.content}</Text>

            <Text style={styles.commentHeader}>댓글</Text>
            {comments.length === 0 ? (
                <Text style={styles.noComment}>등록된 댓글이 없습니다.</Text>
                ) : (
                comments.map((cmt, idx) => (
                    <View key={idx.toString()} style={styles.commentBox}>
                    <View style={styles.commentRow}>
                        {cmt.authorAvatarUrl ? (
                        <Image source={{ uri: cmt.authorAvatarUrl }} style={styles.commentAvatar} />
                        ) : (
                        <View style={styles.commentAvatar} />
                        )}
                        <Text style={styles.commentText}>{cmt.content}</Text>
                        
                        {/* ... 아이콘 생성 */}
                        <TouchableOpacity
                            onPress={() => toggleModal(cmt.commentId || cmt.id)}
                            style={styles.moreButton}
                        >
                        <Icon name="more-horiz" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    </View>
                ))
            )}

        
        </ScrollView>

        {/* 댓글 입력창 */}
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.inputContainer}>
            {myAvatarUrl && (
                <Image
                source={{ uri: myAvatarUrl }}
                style={styles.avatar}
                />
            )}
            <TextInput
                style={styles.input}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add your comments"
                placeholderTextColor="#999"
                editable={!postingComment}
            />
            <TouchableOpacity
                onPress={handleSendComment}
                style={styles.sendButton}
                disabled={postingComment || !newComment.trim()}
            >
                <Icon
                name="send"
                size={20}
                color={newComment.trim() ? '#1D7C3E' : '#ccc'}
                />
            </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

        {/* ... 모듈 */}
        <Modal 
            isVisible={isModalVisible}
            onBackdropPress={toggleModal}
            style={styles.modal}
        >
        <View style={styles.modalContent}>
            <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                toggleModal();
            }}
            >
                <Text style={styles.modalText}>Delete</Text>
                <Icon name="delete" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                // 수정 화면으로 이동
                toggleModal();
                navigation.navigate('EditComment', { commentId: selectedCommentId });
            }}
            >
                <Text style={styles.modalText}>Edit</Text>
                <Icon name="edit" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                // 신고 로직
                Alert.alert('신고 완료');
                toggleModal();
            }}
            >
                <Text style={styles.modalText}>Report</Text>
                <Icon name="flag" size={20} color="#333" />            
            </TouchableOpacity>
        </View>
        </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: { flex: 1, backgroundColor: '#fff' },
    header: { 
        height: '10%', 
        justifyContent: 'center' 
    },

    contentContainer: {
        padding: 16,
        paddingBottom: 100, // 입력창 여유
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    content: {
        fontSize: 16,
        marginBottom: 24,
    },
    commentHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    noComment: {
        fontSize: 14,
        color: '#999',
        marginBottom: 16,
    },
    commentBox: {
        backgroundColor: '#f3f3f3',
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
        backgroundColor: '#ddd',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fafafa',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: '#eee',
    },
    input: {
        flex: 1,
        height: 36,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    sendButton: {
        marginLeft: 8,
        padding: 4,
    },
    moreButton: {
        marginLeft: 'auto',
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
});
