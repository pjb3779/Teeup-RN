import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Alert,
    ActivityIndicator,
    Image 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
    getUserProfile,
    updateUserProfile,
} from '../../../services/userService';

export default function EditProfileScreen({ route, navigation }) {
    const [loading, setLoading]     = useState(true);
    const [nickname, setNickname]   = useState('');
    const [gender, setGender]       = useState('');
    const [age, setAge]             = useState('');
    const [golfLevel, setGolfLevel] = useState('');
    const [avatarUri, setAvatarUri] = useState(null);
    const [image, setImage]       = useState(null);

    useEffect(() => {
        (async () => {
        try {
            const profile = await getUserProfile();
            setNickname(profile.nickname || '');
            setGender(profile.gender || '');
            setAge(profile.age != null ? String(profile.age) : '');
            setGolfLevel(profile.golfLevel != null ? String(profile.golfLevel) : '');
            setAvatarUri(profile.avatarUrl || null);
        } catch (e) {
            Alert.alert('오류', e.message);
        } finally {
            setLoading(false);
        }
        })();
    }, []);

    const pickImage = async () => {
        // 사진첩 접근 권한 요청
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
        return Alert.alert('권한 필요', '이미지 접근 권한을 허용해주세요.');
        }

        // 이미지 선택 창
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8
        });

        if (!result.cancelled) {
            setImage(result.assets[0]); // 사진을 한장만 선택하게 한다.
            setAvatarUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        try {
        const payload = {
            nickname,
            gender,
            age: age ? parseInt(age, 10) : null,
            golfLevel: golfLevel ? parseInt(golfLevel, 10) : null,
            image,
        };
        await updateUserProfile(payload);
        
        Alert.alert('성공', '프로필이 저장되었습니다.');
        navigation.goBack();
        } catch (error) {
        Alert.alert('오류', error.message);
        }
    };

    if (loading) {
        return (
        <View style={styles.loader}>
            <ActivityIndicator size="large" />
        </View>
        );
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Setting your profile to get started</Text>

        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
            <View style={styles.avatarPlaceholder}>
                <Text>사진 선택</Text>
            </View>
            )}
        </TouchableOpacity>

        {[
            { label: 'Nickname', value: nickname, setter: setNickname, placeholder: 'None' },
            { label: 'Gender',   value: gender,   setter: setGender,   placeholder: 'Male / Female' },
            { label: 'Age',      value: age,      setter: setAge,      placeholder: 'ex) 20',       keyboardType: 'numeric' },
            { label: 'Golf Level', value: golfLevel, setter: setGolfLevel, placeholder: 'ex) 18',  keyboardType: 'numeric' }
        ].map(({ label, value, setter, placeholder, keyboardType }, i) => (
            <View key={i} style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={setter}
                placeholder={placeholder}
                placeholderTextColor="#8F9098"
                keyboardType={keyboardType}
            />
            </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,  // 0.5 * 16px = 8px 간격을 설정
        marginTop: 40,
        marginLeft: 5,
    },
    subtitle: {
        color: '#71727A',  // Neutral-Dark-Light color
        fontFamily: 'Inter',  // Inter font
        fontSize: 12,  // 0.75rem is equivalent to 12px
        fontStyle: 'normal',  // Font style normal
        fontWeight: '400',  // Regular font weight
        letterSpacing: 0.75,
        marginBottom: 20,  // Increased bottom margin to space it more from Nickname
    },
    avatarWrapper: { 
        alignItems:'center', 
        marginBottom:20 
    },
    avatar: { 
        width:100, 
        height:100, 
        borderRadius:50 
    },
    avatarPlaceholder: {
        width:100, 
        height:100, 
        backgroundColor:'#ccc',
        borderRadius:50, 
        justifyContent:'center', 
        alignItems:'center'
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#4a90e2',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
