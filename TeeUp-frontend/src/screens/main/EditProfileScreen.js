import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { updateUserProfile } from '../../services/userService'; 

export default function EditProfileScreen({ route, navigation }){
    const { profile } = route.params;       // 프로필 속 데이터 꺼내오기
    const [nickname, setNickname] = useState(profile.nickname);
    const [gender, setGender] = useState(profile.gender);
    const [age, setAge] = useState(profile.age);
    const [golfLevel, setGolfLevel] = useState(profile.golfLevel);
    //const [golfStyle, setGolfStyle] = useState(profile.golfStyle);

    const handleSave = async () => {
        try{
            const profileData = { nickname, gender, age, golfLevel};
            await updateUserProfile(profileData);

            Alert.alert('성공', '프로필이 성공적으로 저장되었습니다.');
            navigation.goBack();        
        }
        catch (error) {
            Alert.alert('오류', error.message || '프로필 저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nickname</Text>
                <TextInput
                    style={styles.input}
                    value={nickname}
                    onChangeText={setNickname}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                    style={styles.input}
                    value={gender}
                    onChangeText={setGender}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                    style={styles.input}
                    value={String(age)}
                    onChangeText={setAge}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Golf Level</Text>
                <TextInput
                    style={styles.input}
                    value={golfLevel}
                    onChangeText={setGolfLevel}
                />
            </View>

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
        marginBottom: 20,
        marginTop: 40,
        marginLeft: 5,
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
