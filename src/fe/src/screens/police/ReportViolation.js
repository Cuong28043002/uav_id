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

const ReportViolation = ({ route, navigation }) => {
  const params = route.params || {};

  const [droneId, setDroneId] = useState(params.droneId ? String(params.droneId) : '');
  const [userId, setUserId] = useState(params.userId ? String(params.userId) : '');
  const [serialNumber, setSerialNumber] = useState(params.serialNumber || '');
  const [ownerName, setOwnerName] = useState(params.ownerName || '');

  const [violationType, setViolationType] = useState('');
  const [description, setDescription] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [dateRecorded, setDateRecorded] = useState(new Date().toISOString().split('T')[0]);

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
        setUserId(String(drone.owner_id));
        setOwnerName(drone.owner?.full_name || 'N/A');
        Alert.alert('Thành công', `Đã tìm thấy UAV dòng ${drone.model_name} của chủ sở hữu ${drone.owner?.full_name || 'N/A'}`);
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
    if (!droneId || !userId || !violationType.trim()) {
      Alert.alert('Thông báo', 'Vui lòng xác định UAV, chủ sở hữu và loại vi phạm.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/violations', {
        drone_id: parseInt(droneId),
        user_id: parseInt(userId),
        violation_type: violationType.trim(),
        description: description.trim() || null,
        fine_amount: fineAmount ? parseFloat(fineAmount) : null,
        date_recorded: dateRecorded,
      });

      if (response.data?.success) {
        // Increment shift stats if in active shift
        try {
          const activeShiftStr = await AsyncStorage.getItem('active_shift');
          if (activeShiftStr) {
            const activeShift = JSON.parse(activeShiftStr);
            activeShift.stats = activeShift.stats || { inspections: 0, violations: 0 };
            activeShift.stats.violations += 1;
            await AsyncStorage.setItem('active_shift', JSON.stringify(activeShift));
          }
        } catch (storageError) {
          console.error('Lỗi cập nhật số liệu ca trực:', storageError);
        }

        Alert.alert('Thành công', 'Đã ghi nhận biên bản vi phạm lên hệ thống!', [
          { text: 'Quay lại', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu biên bản vi phạm.');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Gặp lỗi trong quá trình kết nối.');
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
            <Text style={styles.headerTitle}>Ghi Nhận Vi Phạm UAV</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Xác định thiết bị vi phạm</Text>

              {!params.droneId && (
                <View style={styles.lookupSection}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Tra cứu Serial Number (S/N):</Text>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                        placeholder="Nhập S/N để liên kết tự động"
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
                    Đã liên kết UAV (ID: {droneId}) - Chủ sở hữu: {ownerName}
                  </Text>
                </View>
              ) : null}

              <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Nội dung biên bản</Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Hành vi vi phạm *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: Bay vào vùng cấm, Vượt độ cao trần bay..."
                  placeholderTextColor="#94A3B8"
                  value={violationType}
                  onChangeText={setViolationType}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mức tiền xử phạt (VNĐ)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Để trống nếu chỉ nhắc nhở cảnh cáo"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={fineAmount}
                  onChangeText={setFineAmount}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Ngày phát hiện vi phạm *</Text>
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => setPickerVisible(true)}
                >
                  <Text style={[styles.dateTimeText, !dateRecorded && styles.placeholderText]}>
                    {dateRecorded ? new Date(dateRecorded).toLocaleDateString('vi-VN') : 'Chọn ngày ghi nhận'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#0080FF" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mô tả chi tiết bằng chứng & sự việc</Text>
                <TextInput
                  style={[styles.input, { height: 90, textAlignVertical: 'top', paddingTop: 12 }]}
                  placeholder="Ghi chú tọa độ vi phạm, hướng bay, hành vi không tuân thủ hiệu lệnh..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.submitBtnText}>GHI NHẬN HỒ SƠ VI PHẠM</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <DateTimePickerModal
            visible={pickerVisible}
            onClose={() => setPickerVisible(false)}
            title="Chọn ngày phát hiện vi phạm"
            onConfirm={(formattedDate) => {
              // Lấy phần YYYY-MM-DD
              setDateRecorded(formattedDate.split('T')[0]);
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
  row: {
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
  submitBtn: {
    backgroundColor: '#EF4444',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    shadowColor: '#EF4444',
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

export default ReportViolation;
