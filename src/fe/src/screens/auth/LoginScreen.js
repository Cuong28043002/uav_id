import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

import { useAuth } from '../../navigation/AppNavigator';

const LoginScreen = ({ navigation }) => {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      const { success, data, message } = response.data;

      if (success && data?.token) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        const userRole = data.user.role?.toLowerCase();
        
        if (auth && auth.setUserRole) {
          auth.setUserRole(userRole);
        } else {
          if (userRole === 'admin') {
            navigation.replace('AdminHome');
          } else if (userRole === 'police') {
            navigation.replace('PoliceHome');
          } else {
            navigation.replace('UserHome');
          }
        }
      } else {
        setErrorMsg(message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data?.message || 'Email hoặc mật khẩu không chính xác.');
      } else if (error.request) {
        setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
      } else {
        setErrorMsg('Có lỗi xảy ra trong quá trình đăng nhập.');
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <View style={styles.innerContainer}>
                {/* DECORATIVE Tech Blobs */}
                <View style={styles.techBlob1} />
                <View style={styles.techBlob2} />

                <View style={styles.headerSection}>
                  <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name="drone" size={56} color="#0080FF" />
                  </View>
                  <Text style={styles.titleText}>UAV ID SYSTEM</Text>
                  <Text style={styles.subtitleText}>
                    Hệ thống Quản lý và Định danh UAV Quốc gia
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Đăng Nhập</Text>

                  {errorMsg ? (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={20} color="#D9383A" />
                      <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                  ) : null}

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Tài khoản Email</Text>
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
                    <Text style={styles.inputLabel}>Mật khẩu</Text>
                    <View style={styles.inputFieldContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#A0AAB0"
                        secureTextEntry={secureText}
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setSecureText(!secureText)}
                      >
                        <Ionicons
                          name={secureText ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color="#7F8C8D"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.formFooter}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                      <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                      <Text style={styles.registerLinkText}>Đăng ký tài khoản</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.footerSection}>
                  <Text style={styles.footerInfo}>Phiên bản 1.0.0 (Beta)</Text>
                  <Text style={styles.footerCopyright}>© 2026 Cục Hàng không Việt Nam</Text>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
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
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  techBlob1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0080FF',
    opacity: 0.04,
    top: 20,
    right: -40,
  },
  techBlob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#0080FF',
    opacity: 0.03,
    bottom: 80,
    left: -80,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EBF3FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1C2833',
    letterSpacing: 1.5,
  },
  subtitleText: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 6,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    marginVertical: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 18,
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
  eyeIcon: {
    padding: 4,
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  forgotText: {
    color: '#7F8C8D',
    fontSize: 13,
    fontWeight: '500',
  },
  registerLinkText: {
    color: '#0080FF',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    height: 52,
    backgroundColor: '#0080FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  footerSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerInfo: {
    fontSize: 11,
    color: '#95A5A6',
  },
  footerCopyright: {
    fontSize: 11,
    color: '#BDC3C7',
    marginTop: 4,
  },
});

export default LoginScreen;
