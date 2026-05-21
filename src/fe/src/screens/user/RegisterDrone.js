import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

const RegisterDrone = ({ navigation }) => {
  const [modelName, setModelName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');

  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMId, setSelectedMId] = useState(null);
  const [selectedCId, setSelectedCId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          axiosClient.get('/manufacturers'),
          axiosClient.get('/drone-categories'),
        ]);
        setManufacturers(mRes.data?.data || []);
        setCategories(cRes.data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setInitLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleSubmit = async () => {
    if (!modelName.trim() || !serialNumber.trim() || !weight || !maxHeight || !selectedMId || !selectedCId) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ tất cả thông tin.');
      return;
    }

    setLoading(true);
    try {
      const droneResponse = await axiosClient.post('/drones', {
        model_name: modelName.trim(),
        serial_number: serialNumber.trim(),
        weight: parseFloat(weight),
        max_flight_height: parseFloat(maxHeight),
        manufacturer_id: parseInt(selectedMId),
        category_id: parseInt(selectedCId),
      });

      if (droneResponse.data?.success && droneResponse.data?.data?.id) {
        const newDroneId = droneResponse.data.data.id;

        await axiosClient.post('/registrations', {
          drone_id: newDroneId,
        });

        Alert.alert('Thành công', 'Đã lưu thông tin UAV và tự động nộp hồ sơ định danh.', [
          { text: 'Quay lại danh sách', onPress: () => navigation.replace('MyDrones') }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể tạo mới thiết bị.');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi kết nối.');
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0080FF" />
      </View>
    );
  }

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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đăng Ký Định Danh UAV</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formCard}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Tên dòng máy bay (Model) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: DJI Mavic 3 Pro"
                  placeholderTextColor="#94A3B8"
                  value={modelName}
                  onChangeText={setModelName}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Số Serial Number (S/N) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mã số S/N sản phẩm"
                  placeholderTextColor="#94A3B8"
                  value={serialNumber}
                  onChangeText={setSerialNumber}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Trọng lượng (kg) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ví dụ: 0.95"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Độ cao bay tối đa (m) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ví dụ: 120"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={maxHeight}
                    onChangeText={setMaxHeight}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Chọn Nhà sản xuất *</Text>
              <View style={styles.pickerContainer}>
                {manufacturers.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.pickerItem,
                      selectedMId === item.id && styles.pickerItemActive,
                    ]}
                    onPress={() => setSelectedMId(item.id)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedMId === item.id && styles.pickerItemTextActive,
                      ]}
                    >
                      {item.name} ({item.country})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Chọn Phân loại UAV *</Text>
              <View style={styles.pickerContainer}>
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.pickerItem,
                      selectedCId === item.id && styles.pickerItemActive,
                    ]}
                    onPress={() => setSelectedCId(item.id)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedCId === item.id && styles.pickerItemTextActive,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>ĐĂNG KÝ UAV</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 3,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  pickerItem: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerItemActive: {
    backgroundColor: '#0080FF',
    borderColor: '#0080FF',
  },
  pickerItemText: {
    color: '#475569',
    fontSize: 13,
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#0080FF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#7FB3D5',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RegisterDrone;
