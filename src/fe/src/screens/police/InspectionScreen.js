import React, { useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import DateTimePickerModal from '../../components/DateTimePickerModal';

const InspectionScreen = ({ route, navigation }) => {
  const params = route.params || {};

  const [droneId, setDroneId] = useState(params.droneId ? String(params.droneId) : '');
  const [serialNumber, setSerialNumber] = useState(params.serialNumber || '');
  const [result, setResult] = useState('pass');
  const [notes, setNotes] = useState('');
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleLookupSerial = async () => {
    if (!serialNumber.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập số S/N của UAV.');
      return;
    }

    setLookupLoading(true);
    try {
      const response = await axiosClient.get(`/drones?q=${serialNumber.trim()}`);
      const list = response.data?.data || [];
      if (list.length > 0) {
        const drone = list[0];
        setDroneId(String(drone.id));
        Alert.alert('Thành công', `Đã tìm thấy UAV dòng ${drone.model_name}`);
      } else {
        Alert.alert('Không tìm thấy', 'Không có thiết bị UAV nào ứng với số S/N này.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tra cứu thông tin thiết bị.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!droneId) {
      Alert.alert('Thông báo', 'Vui lòng xác định UAV cần lập biên bản kiểm tra.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/inspections', {
        drone_id: parseInt(droneId),
        result: result,
        notes: notes.trim() || null,
        inspection_date: inspectionDate,
      });

      if (response.data?.success) {
        // Increment shift stats if in active shift
        try {
          const activeShiftStr = await AsyncStorage.getItem('active_shift');
          if (activeShiftStr) {
            const activeShift = JSON.parse(activeShiftStr);
            activeShift.stats = activeShift.stats || { inspections: 0, violations: 0 };
            activeShift.stats.inspections += 1;
            await AsyncStorage.setItem('active_shift', JSON.stringify(activeShift));
          }
        } catch (storageError) {
          console.error('Lỗi cập nhật số liệu ca trực:', storageError);
        }

        Alert.alert('Thành công', 'Đã lưu biên bản kiểm tra UAV thành công!', [
          { text: 'Quay lại', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu biên bản kiểm tra.');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi gửi dữ liệu.');
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Lập Biên Bản Kiểm Tra UAV</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Xác định UAV kiểm tra</Text>

              {!params.droneId && (
                <View style={styles.lookupSection}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Nhập số Serial Number (S/N)</Text>
                    <View style={styles.lookupRow}>
                      <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        placeholder="Nhập S/N để tra cứu nhanh"
                        placeholderTextColor="#94A3B8"
                        value={serialNumber}
                        onChangeText={setSerialNumber}
                      />
                      <TouchableOpacity
                        style={styles.lookupBtn}
                        onPress={handleLookupSerial}
                        disabled={lookupLoading}
                      >
                        {lookupLoading ? (
                          <ActivityIndicator color="#0080FF" size="small" />
                        ) : (
                          <Ionicons name="search" size={20} color="#0080FF" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {droneId ? (
                <View style={styles.linkedCard}>
                  <Ionicons name="link" size={18} color="#10B981" />
                  <Text style={styles.linkedText}>
                    Đã liên kết UAV (ID: {droneId})
                  </Text>
                </View>
              ) : null}

              <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Kết quả đánh giá kiểm tra</Text>

              <View style={styles.resultPickerGrid}>
                <TouchableOpacity
                  style={[
                    styles.resultItem,
                    result === 'pass' && styles.resultItemPassActive,
                  ]}
                  onPress={() => setResult('pass')}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={result === 'pass' ? '#FFFFFF' : '#10B981'}
                  />
                  <Text
                    style={[
                      styles.resultItemText,
                      result === 'pass' && styles.resultItemTextActive,
                    ]}
                  >
                    ĐẠT TIÊU CHUẨN
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.resultItem,
                    result === 'fail' && styles.resultItemFailActive,
                  ]}
                  onPress={() => setResult('fail')}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={result === 'fail' ? '#FFFFFF' : '#EF4444'}
                  />
                  <Text
                    style={[
                      styles.resultItemText,
                      result === 'fail' && styles.resultItemTextActive,
                    ]}
                  >
                    KHÔNG ĐẠT (LỖI)
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Ngày thực hiện kiểm tra *</Text>
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => setPickerVisible(true)}
                >
                  <Text style={[styles.dateTimeText, !inspectionDate && styles.placeholderText]}>
                    {inspectionDate ? new Date(inspectionDate).toLocaleDateString('vi-VN') : 'Chọn ngày kiểm tra'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#0080FF" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Chi tiết nội dung & kiến nghị kiểm tra</Text>
                <TextInput
                  style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                  placeholder="Ghi chú tình trạng pin, khung vỏ, cánh quạt, đăng kiểm, hệ thống định vị vệ tinh..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="save-sharp" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.submitBtnText}>LƯU BIÊN BẢN KIỂM TRA</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <DateTimePickerModal
            visible={pickerVisible}
            onClose={() => setPickerVisible(false)}
            title="Chọn ngày thực hiện kiểm tra"
            onConfirm={(formattedDate) => {
              setInspectionDate(formattedDate.split('T')[0]);
            }}
          />
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
  sectionTitle: {
    color: '#0080FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 14,
  },
  lookupSection: {
    marginBottom: 10,
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
  lookupRow: {
    flexDirection: 'row',
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
  dateTimeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 16,
  },
  dateTimeText: {
    color: '#0F172A',
    fontSize: 14,
  },
  placeholderText: {
    color: '#94A3B8',
  },
  lookupBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  linkedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  linkedText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  resultPickerGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  resultItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    gap: 8,
  },
  resultItemPassActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  resultItemFailActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  resultItemText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultItemTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#0080FF',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
});

export default InspectionScreen;
