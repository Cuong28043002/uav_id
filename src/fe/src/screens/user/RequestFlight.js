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
  ImageBackground,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import DateTimePickerModal from '../../components/DateTimePickerModal';
import Alert from '../../components/CustomAlert';

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

  const [dronePickerVisible, setDronePickerVisible] = useState(false);
  const [zonePickerVisible, setZonePickerVisible] = useState(false);
  const [droneSearch, setDroneSearch] = useState('');
  const [zoneSearch, setZoneSearch] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [dronesRes, zonesRes] = await Promise.all([
          axiosClient.get('/drones'),
          axiosClient.get('/flight/zones'),
        ]);

        const approvedDrones = (dronesRes.data?.data || []).filter(
          (d) => {
            const reg = d.registrations && d.registrations[0];
            return reg?.status === 'approved';
          }
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

  const filteredDrones = drones.filter((d) =>
    d.model_name.toLowerCase().includes(droneSearch.toLowerCase()) ||
    (d.serial_number && d.serial_number.toLowerCase().includes(droneSearch.toLowerCase()))
  );

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(zoneSearch.toLowerCase()) ||
    (z.zone_type && z.zone_type.toLowerCase().includes(zoneSearch.toLowerCase()))
  );

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
            <Text style={styles.headerTitle}>Cấp Phép Bay Chuyến</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Intro banner */}
            <View style={styles.introCard}>
              <View style={styles.introIconBg}>
                <Ionicons name="paper-plane" size={22} color="#0080FF" />
              </View>
              <View style={styles.introTextCol}>
                <Text style={styles.introTitle}>Kế hoạch bay chuyến</Text>
                <Text style={styles.introDesc}>
                  Chọn thiết bị đã định danh, xác định vùng hoạt động và lịch trình bay cụ thể của bạn.
                </Text>
              </View>
            </View>

            <View style={styles.formCard}>
              {/* Section 1: Chọn thiết bị */}
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="airplane-outline" size={16} color="#0080FF" />
                <Text style={styles.sectionTitle}>Thiết bị UAV của chuyến bay *</Text>
              </View>

              {drones.length === 0 ? (
                <Text style={styles.noDronesText}>
                  Không tìm thấy UAV nào đã được duyệt định danh. Vui lòng đăng ký định danh thiết bị trước khi nộp đơn xin phép bay.
                </Text>
              ) : (
                <View style={styles.inputWrapper}>
                  <TouchableOpacity
                    style={styles.pickerField}
                    activeOpacity={0.7}
                    onPress={() => setDronePickerVisible(true)}
                  >
                    <Ionicons name="airplane-outline" size={18} color="#0080FF" style={styles.pickerFieldIcon} />
                    <Text style={[styles.pickerFieldText, !selectedDroneId && styles.pickerFieldPlaceholder]}>
                      {selectedDroneId
                        ? drones.find((d) => d.id === selectedDroneId)?.model_name
                        : 'Chọn thiết bị UAV'}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Section 2: Vùng hoạt động */}
              <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
                <Ionicons name="location-outline" size={16} color="#0080FF" />
                <Text style={styles.sectionTitle}>Khu vực bay đăng ký *</Text>
              </View>

              <View style={styles.inputWrapper}>
                <TouchableOpacity
                  style={styles.pickerField}
                  activeOpacity={0.7}
                  onPress={() => setZonePickerVisible(true)}
                >
                  <Ionicons name="location-outline" size={18} color="#0080FF" style={styles.pickerFieldIcon} />
                  <Text style={[styles.pickerFieldText, !selectedZoneId && styles.pickerFieldPlaceholder]}>
                    {selectedZoneId
                      ? zones.find((z) => z.id === selectedZoneId)?.name
                      : 'Chọn khu vực bay'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Section 3: Lịch trình & mục đích */}
              <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
                <Ionicons name="calendar-outline" size={16} color="#0080FF" />
                <Text style={styles.sectionTitle}>Lịch trình & Mục đích</Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Thời gian bắt đầu *</Text>
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => {
                    setPickerTarget('start');
                    setPickerVisible(true);
                  }}
                  activeOpacity={0.7}
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
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dateTimeText, !endTime && styles.placeholderText]}>
                    {endTime ? formatDisplayDateTime(endTime) : 'Chọn thời gian kết thúc'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#0080FF" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mục đích hoạt động bay *</Text>
                <View style={styles.purposeInputContainer}>
                  <Ionicons name="document-text-outline" size={18} color="#94A3B8" style={styles.purposeIcon} />
                  <TextInput
                    style={styles.purposeInput}
                    placeholder="Mô tả chi tiết mục đích bay chuyến của bạn..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={4}
                    value={purpose}
                    onChangeText={setPurpose}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={loading || drones.length === 0}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <LinearGradient
                    colors={drones.length === 0 ? ['#94A3B8', '#94A3B8'] : ['#0080FF', '#0059B2']}
                    style={styles.submitBtnGradient}
                  >
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>GỬI ĐƠN XIN PHÉP BAY</Text>
                  </LinearGradient>
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

      {/* Selection Modals */}
      <Modal
        visible={dronePickerVisible}
        animationType="slide"
        onRequestClose={() => {
          setDronePickerVisible(false);
          setDroneSearch('');
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setDronePickerVisible(false);
                setDroneSearch('');
              }}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Chọn Thiết bị UAV</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalSearchContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.modalSearchIcon} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Tìm kiếm thiết bị..."
              placeholderTextColor="#94A3B8"
              value={droneSearch}
              onChangeText={setDroneSearch}
            />
            {droneSearch.length > 0 && (
              <TouchableOpacity onPress={() => setDroneSearch('')}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredDrones}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const active = selectedDroneId === item.id;
              return (
                <TouchableOpacity
                  style={[styles.modalItem, active && styles.modalItemActive]}
                  onPress={() => {
                    setSelectedDroneId(item.id);
                    setDronePickerVisible(false);
                    setDroneSearch('');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalItemLeft}>
                    <Ionicons
                      name="airplane"
                      size={20}
                      color={active ? '#0080FF' : '#64748B'}
                      style={{ marginRight: 12 }}
                    />
                    <View>
                      <Text style={[styles.modalItemText, active && styles.modalItemTextActive]}>
                        {item.model_name}
                      </Text>
                      <Text style={styles.modalItemSubtext}>S/N: {item.serial_number}</Text>
                    </View>
                  </View>
                  {active && (
                    <Ionicons name="checkmark-circle" size={20} color="#0080FF" />
                  )}
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.modalListContent}
            ListEmptyComponent={
              <View style={styles.modalEmptyContainer}>
                <Text style={styles.modalEmptyText}>Không tìm thấy thiết bị nào</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={zonePickerVisible}
        animationType="slide"
        onRequestClose={() => {
          setZonePickerVisible(false);
          setZoneSearch('');
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setZonePickerVisible(false);
                setZoneSearch('');
              }}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Chọn Khu vực bay</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalSearchContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.modalSearchIcon} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Tìm kiếm khu vực..."
              placeholderTextColor="#94A3B8"
              value={zoneSearch}
              onChangeText={setZoneSearch}
            />
            {zoneSearch.length > 0 && (
              <TouchableOpacity onPress={() => setZoneSearch('')}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredZones}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const active = selectedZoneId === item.id;
              const isForbidden = item.zone_type === 'forbidden';
              const isRestricted = item.zone_type === 'restricted';
              const zoneColor = isForbidden ? '#EF4444' : isRestricted ? '#F59E0B' : '#10B981';

              return (
                <TouchableOpacity
                  style={[styles.modalItem, active && styles.modalItemActive]}
                  onPress={() => {
                    setSelectedZoneId(item.id);
                    setZonePickerVisible(false);
                    setZoneSearch('');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalItemLeft}>
                    <Ionicons
                      name="navigate-circle-outline"
                      size={20}
                      color={active ? '#0080FF' : zoneColor}
                      style={{ marginRight: 12 }}
                    />
                    <View>
                      <Text style={[styles.modalItemText, active && styles.modalItemTextActive]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.modalItemSubtext, { color: zoneColor, fontWeight: 'bold' }]}>
                        {item.zone_type.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  {active && (
                    <Ionicons name="checkmark-circle" size={20} color="#0080FF" />
                  )}
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.modalListContent}
            ListEmptyComponent={
              <View style={styles.modalEmptyContainer}>
                <Text style={styles.modalEmptyText}>Không tìm thấy khu vực bay nào</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
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
  scrollContent: {
    padding: 16,
  },
  introCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  introIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  introTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  introDesc: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
    lineHeight: 16,
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
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noDronesText: {
    color: '#EF4444',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
  },
  pickerFieldIcon: {
    marginRight: 8,
  },
  pickerFieldText: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
  },
  pickerFieldPlaceholder: {
    color: '#94A3B8',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalSearchIcon: {
    marginRight: 8,
  },
  modalSearchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  modalListContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalItemActive: {
    borderColor: '#0080FF',
    backgroundColor: '#F0F9FF',
  },
  modalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  modalItemTextActive: {
    color: '#0080FF',
    fontWeight: 'bold',
  },
  modalItemSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  modalEmptyText: {
    color: '#64748B',
    fontSize: 14,
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
  purposeInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  purposeIcon: {
    marginRight: 8,
    marginTop: 4,
  },
  purposeInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    textAlignVertical: 'top',
    height: 80,
    padding: 0,
  },
  submitBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 12,
    height: 50,
  },
  submitBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RequestFlight;
