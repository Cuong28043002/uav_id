import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cccd, setCccd] = useState('');
  const [address, setAddress] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');

    if (!fullName || !email || !password) {
      setErrorMsg('Họ tên, email và mật khẩu là bắt buộc.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu tối thiểu phải từ 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/register', {
        full_name: fullName,
        email: email.trim(),
        password: password,
        phone: phone || null,
        cccd_number: cccd || null,
        address: address || null,
      });

      const { success, message } = response.data;

      if (success) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.', [
          { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        setErrorMsg(message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data?.message || 'Thông tin đăng ký không hợp lệ.');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/light_bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.85)', 'rgba(226, 232, 240, 0.95)']}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#1C2833" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đăng Ký Tài Khoản</Text>
              </View>

              <View style={styles.form}>
                {errorMsg ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color="#D9383A" />
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                ) : null}

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Họ và tên *</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="person-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nguyễn Văn A"
                      placeholderTextColor="#A0AAB0"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email *</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="mail-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="example@uavid.vn"
                      placeholderTextColor="#A0AAB0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Mật khẩu *</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Tối thiểu 6 ký tự"
                      placeholderTextColor="#A0AAB0"
                      secureTextEntry={secureText}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                      <Ionicons name={secureText ? 'eye-off-outline' : 'eye-outline'} size={20} color="#7F8C8D" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Số điện thoại</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="call-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="09xxxxxxxx"
                      placeholderTextColor="#A0AAB0"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Số CCCD / Hộ chiếu</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="card-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="001xxxxxxxx"
                      placeholderTextColor="#A0AAB0"
                      keyboardType="number-pad"
                      value={cccd}
                      onChangeText={setCccd}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Địa chỉ thường trú</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="location-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Số nhà, đường, tỉnh thành..."
                      placeholderTextColor="#A0AAB0"
                      value={address}
                      onChangeText={setAddress}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>ĐĂNG KÝ NGAY</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Đã có tài khoản? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    backgroundColor: '#EBF3FC',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C2833',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F2',
    borderColor: '#F8D7DA',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#D9383A',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F4',
    borderWidth: 1,
    borderColor: '#E5E7E9',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
  },
  button: {
    height: 52,
    backgroundColor: '#0080FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#7FB3D5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#7F8C8D',
    fontSize: 14,
  },
  loginLink: {
    color: '#0080FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
