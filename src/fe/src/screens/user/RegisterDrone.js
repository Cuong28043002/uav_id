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
import Alert from '../../components/CustomAlert';

const RegisterDrone = ({ navigation }) => {
  const [modelName, setModelName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');

  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMId, setSelectedMId] = useState(null);
  const [selectedCId, setSelectedCId] = useState(null);

  const [mPickerVisible, setMPickerVisible] = useState(false);
  const [cPickerVisible, setCPickerVisible] = useState(false);
  const [mSearch, setMSearch] = useState('');
  const [cSearch, setCSearch] = useState('');

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

  const filteredMfrs = manufacturers.filter((m) =>
    m.name.toLowerCase().includes(mSearch.toLowerCase()) ||
    (m.country && m.country.toLowerCase().includes(mSearch.toLowerCase()))
  );

  const filteredCats = categories.filter((c) =>
    c.name.toLowerCase().includes(cSearch.toLowerCase())
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
            <Text style={styles.headerTitle}>Đăng Ký Định Danh UAV</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Intro banner */}
            <View style={styles.introCard}>
              <View style={styles.introIconBg}>
                <Ionicons name="shield-checkmark" size={24} color="#0080FF" />
              </View>
              <View style={styles.introTextCol}>
                <Text style={styles.introTitle}>Định Danh UAV Quốc Gia</Text>
                <Text style={styles.introDesc}>
                  Điền chính xác thông tin để hệ thống khởi tạo hồ sơ định danh tự động và gửi phê duyệt.
                </Text>
              </View>
            </View>

            <View style={styles.formCard}>
              {/* Section 1: Thống tin thiết bị */}
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="airplane-outline" size={16} color="#0080FF" />
                <Text style={styles.sectionTitle}>Thông tin thiết bị</Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Tên dòng máy bay (Model) *</Text>
                <View style={styles.inputFieldContainer}>
                  <Ionicons name="airplane" size={18} color="#94A3B8" style={styles.inputFieldIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Ví dụ: DJI Mavic 3 Pro"
                    placeholderTextColor="#94A3B8"
                    value={modelName}
                    onChangeText={setModelName}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Số Serial Number (S/N) *</Text>
                <View style={styles.inputFieldContainer}>
                  <Ionicons name="barcode-outline" size={18} color="#94A3B8" style={styles.inputFieldIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Nhập mã số S/N của thiết bị"
                    placeholderTextColor="#94A3B8"
                    value={serialNumber}
                    onChangeText={setSerialNumber}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Trọng lượng (kg) *</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="barbell-outline" size={18} color="#94A3B8" style={styles.inputFieldIcon} />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Ví dụ: 0.95"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={weight}
                      onChangeText={setWeight}
                    />
                  </View>
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Độ cao tối đa (m) *</Text>
                  <View style={styles.inputFieldContainer}>
                    <Ionicons name="trending-up-outline" size={18} color="#94A3B8" style={styles.inputFieldIcon} />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Ví dụ: 120"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={maxHeight}
                      onChangeText={setMaxHeight}
                    />
                  </View>
                </View>
              </View>

              {/* Section 2: Hãng sản xuất & Phân loại */}
              <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
                <Ionicons name="settings-outline" size={16} color="#0080FF" />
                <Text style={styles.sectionTitle}>Hãng & Phân loại</Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Nhà sản xuất *</Text>
                <TouchableOpacity
                  style={styles.pickerField}
                  activeOpacity={0.7}
                  onPress={() => setMPickerVisible(true)}
                >
                  <Ionicons name="business-outline" size={18} color="#0080FF" style={styles.pickerFieldIcon} />
                  <Text style={[styles.pickerFieldText, !selectedMId && styles.pickerFieldPlaceholder]}>
                    {selectedMId
                      ? manufacturers.find((m) => m.id === selectedMId)?.name
                      : 'Chọn nhà sản xuất'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Phân loại UAV *</Text>
                <TouchableOpacity
                  style={styles.pickerField}
                  activeOpacity={0.7}
                  onPress={() => setCPickerVisible(true)}
                >
                  <Ionicons name="options-outline" size={18} color="#0080FF" style={styles.pickerFieldIcon} />
                  <Text style={[styles.pickerFieldText, !selectedCId && styles.pickerFieldPlaceholder]}>
                    {selectedCId
                      ? categories.find((c) => c.id === selectedCId)?.name
                      : 'Chọn phân loại UAV'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <LinearGradient
                    colors={['#0080FF', '#0059B2']}
                    style={styles.submitBtnGradient}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>ĐĂNG KÝ ĐỊNH DANH UAV</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Picker Modals */}
      <Modal
        visible={mPickerVisible}
        animationType="slide"
        onRequestClose={() => {
          setMPickerVisible(false);
          setMSearch('');
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setMPickerVisible(false);
                setMSearch('');
              }}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Chọn Nhà sản xuất</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalSearchContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.modalSearchIcon} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Tìm kiếm nhà sản xuất..."
              placeholderTextColor="#94A3B8"
              value={mSearch}
              onChangeText={setMSearch}
            />
            {mSearch.length > 0 && (
              <TouchableOpacity onPress={() => setMSearch('')}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredMfrs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const active = selectedMId === item.id;
              return (
                <TouchableOpacity
                  style={[styles.modalItem, active && styles.modalItemActive]}
                  onPress={() => {
                    setSelectedMId(item.id);
                    setMPickerVisible(false);
                    setMSearch('');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalItemLeft}>
                    <Ionicons
                      name="business"
                      size={20}
                      color={active ? '#0080FF' : '#64748B'}
                      style={{ marginRight: 12 }}
                    />
                    <View>
                      <Text style={[styles.modalItemText, active && styles.modalItemTextActive]}>
                        {item.name}
                      </Text>
                      {item.country && (
                        <Text style={styles.modalItemSubtext}>{item.country}</Text>
                      )}
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
                <Text style={styles.modalEmptyText}>Không tìm thấy nhà sản xuất nào</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={cPickerVisible}
        animationType="slide"
        onRequestClose={() => {
          setCPickerVisible(false);
          setCSearch('');
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setCPickerVisible(false);
                setCSearch('');
              }}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Chọn Phân loại UAV</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalSearchContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.modalSearchIcon} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Tìm kiếm phân loại..."
              placeholderTextColor="#94A3B8"
              value={cSearch}
              onChangeText={setCSearch}
            />
            {cSearch.length > 0 && (
              <TouchableOpacity onPress={() => setCSearch('')}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredCats}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const active = selectedCId === item.id;
              return (
                <TouchableOpacity
                  style={[styles.modalItem, active && styles.modalItemActive]}
                  onPress={() => {
                    setSelectedCId(item.id);
                    setCPickerVisible(false);
                    setCSearch('');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalItemLeft}>
                    <Ionicons
                      name="options"
                      size={20}
                      color={active ? '#0080FF' : '#64748B'}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={[styles.modalItemText, active && styles.modalItemTextActive]}>
                      {item.name}
                    </Text>
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
                <Text style={styles.modalEmptyText}>Không tìm thấy phân loại nào</Text>
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
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
  },
  inputFieldIcon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
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

export default RegisterDrone;
