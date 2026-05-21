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
import DateTimePickerModal from '../../components/DateTimePickerModal';

const RequestFlight = ({ navigation }) => {
  const [drones, setDrones] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedDroneId, setSelectedDroneId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // Picker States
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState('start');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [dronesRes, zonesRes] = await Promise.all([
          axiosClient.get('/drones'),
          axiosClient.get('/flight/zones'),
        ]);

        const approvedDrones = (dronesRes.data?.data || []).filter(
          (d) => d.registration?.status === 'approved'
        );

        setDrones(approvedDrones);
        setZones(zonesRes.data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setInitLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleSubmit = async () => {
    if (!selectedDroneId || !selectedZoneId || !startTime.trim() || !endTime.trim() || !purpose.trim()) {
      Alert.alert('Thông báo', 'Vui lòng chọn UAV, Khu vực bay và điền đủ thời gian, mục đích bay.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/flight/permits', {
        drone_id: parseInt(selectedDroneId),
        zone_id: parseInt(selectedZoneId),
        start_time: startTime.trim(),
        end_time: endTime.trim(),
        purpose: purpose.trim(),
      });

      if (response.data?.success) {
        Alert.alert('Thành công', 'Hồ sơ xin cấp phép bay đã được gửi thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể gửi đơn cấp phép bay.');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <Text style={styles.headerTitle}>Đăng Ký Phép Bay Chuyến</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Chọn thiết bị UAV đăng ký bay *</Text>
              {drones.length === 0 ? (
                <Text style={styles.noDronesText}>
                  Không tìm thấy UAV nào đã được duyệt định danh. Vui lòng đăng ký và được phê duyệt định danh trước khi xin phép bay.
                </Text>
              ) : (
                <View style={styles.pickerGrid}>
                  {drones.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.pickerItem,
                        selectedDroneId === item.id && styles.pickerItemActive,
                      ]}
                      onPress={() => setSelectedDroneId(item.id)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedDroneId === item.id && styles.pickerItemTextActive,
                        ]}
                      >
                        {item.model_name} (S/N: {item.serial_number})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.inputLabel}>Chọn khu vực bay đăng ký *</Text>
              <View style={styles.pickerGrid}>
                {zones.map((item) => {
                  const isForbidden = item.zone_type === 'forbidden';
                  const isRestricted = item.zone_type === 'restricted';
                  const zoneColor = isForbidden ? '#EF4444' : isRestricted ? '#F59E0B' : '#10B981';

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.pickerItem,
                        selectedZoneId === item.id && styles.pickerItemActive,
                      ]}
                      onPress={() => setSelectedZoneId(item.id)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedZoneId === item.id && styles.pickerItemTextActive,
                        ]}
                      >
                        {item.name} <Text style={{ color: selectedZoneId === item.id ? '#FFFFFF' : zoneColor, fontWeight: 'bold' }}>({item.zone_type.toUpperCase()})</Text>
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Thời gian bắt đầu *</Text>
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => {
                    setPickerTarget('start');
                    setPickerVisible(true);
                  }}
                >
                  <Text style={[styles.dateTimeText, !startTime && styles.placeholderText]}>
                    {startTime ? formatDisplayDateTime(startTime) : 'Chọn thời gian bắt đầu'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#0080FF" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Thời gian kết thúc *</Text>
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => {
                    setPickerTarget('end');
                    setPickerVisible(true);
                  }}
                >
                  <Text style={[styles.dateTimeText, !endTime && styles.placeholderText]}>
                    {endTime ? formatDisplayDateTime(endTime) : 'Chọn thời gian kết thúc'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#0080FF" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mục đích bay *</Text>
                <TextInput
                  style={[styles.input, { height: 90, textAlignVertical: 'top', paddingTop: 12 }]}
                  placeholder="Mô tả mục đích bay, vd: Khảo sát địa hình, quay phim sự kiện..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={purpose}
                  onChangeText={setPurpose}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, (loading || drones.length === 0) && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={loading || drones.length === 0}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>GỬI ĐƠN XIN PHÉP BAY</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <DateTimePickerModal
            visible={pickerVisible}
            onClose={() => setPickerVisible(false)}
            title={pickerTarget === 'start' ? "Chọn thời gian bắt đầu" : "Chọn thời gian kết thúc"}
            onConfirm={(formattedDate) => {
              if (pickerTarget === 'start') {
                setStartTime(formattedDate);
              } else {
                setEndTime(formattedDate);
              }
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
  inputLabel: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  noDronesText: {
    color: '#EF4444',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  pickerGrid: {
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
    fontSize: 12,
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputWrapper: {
    marginBottom: 16,
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
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RequestFlight;
