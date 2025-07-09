import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const BOX_SIZE = (width - 80) / 8;

export default function VerifyScreen({ navigation, route }) {
  const email = route.params?.email || 'your.email@example.com';
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChange = (text, idx) => {
    // 숫자만 허용
    if (!/^\d$/.test(text)) return;

    const newCode = [...code];
    newCode[idx] = text;
    setCode(newCode);
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace') {
      // 이미 빈 칸이면 이전 칸으로
      if (code[idx] === '' && idx > 0) {
        inputs[idx - 1].current?.focus();
      } else {
        // 삭제 처리
        const newCode = [...code];
        newCode[idx] = '';
        setCode(newCode);
      }
    }
  };

  const handleContinue = () => {
    const pin = code.join('');
      // 검증 로직(4자리 완성 확인) 필요 없으면 주석 제거
      // if (pin.length < 4) return;
      navigation.navigate('Login');
  };

  const handleResend = () => console.log('Resend code');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter confirmation code</Text>
      <Text style={styles.subtitle}>
        A 4-digit code was sent to {email}
      </Text>

      <View style={styles.codeWrapper}>
        {code.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={inputs[idx]}
            style={[
              styles.codeBox,
              digit !== '' && styles.codeBoxFilled,
              idx === code.findIndex(c => c === '') && styles.codeBoxActive,
            ]}
            keyboardType="number-pad"
            //returnKeyType="next"       // 중요!
            //blurOnSubmit={false}       // 중요!
            maxLength={1}
            onChangeText={text => handleChange(text, idx)}
            onKeyPress={e => handleKeyPress(e, idx)}
            onSubmitEditing={() => {
              // 한 글자 입력 후 엔터(실제는 maxLength로 자동 발동) 시 다음 칸으로
              if (idx < inputs.length - 1) {
                inputs[idx + 1].current?.focus();
              }
            }}
            value={digit}
            autoFocus={idx === 0}
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleResend}>
        <Text style={styles.resend}>Resend code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.continueBtn,
          code.join('').length < 4 && styles.continueDisabled,
        ]}
        onPress={handleContinue}
        disabled={code.join('').length < 4}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#004225',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 40,
    textAlign: 'center',
  },
  codeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: BOX_SIZE * 4 + 24,
  },
  codeBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
  },
  codeBoxActive: {
    borderColor: '#004225',
  },
  codeBoxFilled: {
    borderColor: '#004225',
  },
  resend: {
    color: '#004225',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
  },
  continueBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#004225',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueDisabled: {
    backgroundColor: '#AAC7B8',
  },
  continueText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});