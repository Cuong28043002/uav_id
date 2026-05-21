import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

const ForgotPassword = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRequestOtp = async () => {
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Vui lòng nhập email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Email không đúng định dạng.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/forgot-password', {
        email: email.trim(),
      });

      const { success, message, data } = response.data;

      if (success) {
        Alert.alert(
          'Mã OTP',
          `Một mã OTP đã được tạo (Mã test: ${data?.otp || ''}). Vui lòng kiểm tra email.`,
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
      } else {
        setErrorMsg(message || 'Gửi yêu cầu thất bại.');
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data?.message || 'Email không tồn tại trên hệ thống.');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setErrorMsg('');

    if (!otp || !newPassword) {
      setErrorMsg('Mã OTP và mật khẩu mới không được bỏ trống.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/reset-password', {
        email: email.trim(),
        otp_code: otp.trim(),
        new_password: newPassword,
      });

      const { success, message } = response.data;

      if (success) {
        Alert.alert('Thành công', 'Đặt lại mật khẩu thành công!', [
          { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        setErrorMsg(message || 'Đặt lại mật khẩu thất bại.');
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => (step === 2 ? setStep(1) : navigation.goBack())} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1C2833" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đặt Lại Mật Khẩu</Text>
          </View>

          <View style={styles.form}>
            {errorMsg ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#D9383A" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {step === 1 ? (
              <View>
                <Text style={styles.infoText}>
                  Nhập email đăng ký của bạn. Chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
                </Text>
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

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleRequestOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>GỬI MÃ OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.infoText}>
                  Nhập mã OTP nhận được và nhập mật khẩu mới để hoàn tất việc cập nhật.
                </Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Mã OTP</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="keypad-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập 6 chữ số"
                      placeholderTextColor="#A0AAB0"
                      keyboardType="number-pad"
                      value={otp}
                      onChangeText={setOtp}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Tối thiểu 6 ký tự"
                      placeholderTextColor="#A0AAB0"
                      secureTextEntry
                      autoCapitalize="none"
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>XÁC NHẬN ĐỔI MẬT KHẨU</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
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
    paddingHorizontal: 24,
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
  infoText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 20,
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
});

export default ForgotPassword;
