import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

const FlightLogs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  const [drones, setDrones] = useState([]);
  const [permits, setPermits] = useState([]);
  const [selectedDroneId, setSelectedDroneId] = useState(null);
  const [selectedPermitId, setSelectedPermitId] = useState(null);

  const [startTime, setStartTime] = useState(new Date().toISOString());
  const [endTime, setEndTime] = useState(new Date().toISOString());
  const [maxAltitude, setMaxAltitude] = useState('');
  const [distance, setDistance] = useState('');

  const [saveLoading, setSaveLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'list') {
        const response = await axiosClient.get('/flight/logs');
        setLogs(response.data?.data || []);
      } else {
        const [dronesRes, permitsRes] = await Promise.all([
          axiosClient.get('/drones'),
          axiosClient.get('/flight/permits?status=approved'),
        ]);
        setDrones(dronesRes.data?.data || []);
        setPermits(permitsRes.data?.data || []);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSaveLog = async () => {
    if (!selectedDroneId) {
      Alert.alert('Thông báo', 'Vui lòng chọn thiết bị UAV.');
      return;
    }

    setSaveLoading(true);
    try {
      const response = await axiosClient.post('/flight/logs', {
        drone_id: parseInt(selectedDroneId),
        permit_id: selectedPermitId ? parseInt(selectedPermitId) : null,
        start_time: startTime,
        end_time: endTime || null,
        max_altitude: maxAltitude ? parseFloat(maxAltitude) : null,
        distance: distance ? parseFloat(distance) : null,
      });

      if (response.data?.success) {
        Alert.alert('Thành công', 'Đã ghi nhận nhật ký chuyến bay!', [
          { text: 'OK', onPress: () => setActiveTab('list') }
        ]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo nhật ký bay.');
    } finally {
      setSaveLoading(false);
    }
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.modelName}>{item.drone?.model_name || 'UAV'}</Text>
        <Text style={styles.serialText}>S/N: {item.drone?.serial_number}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.logDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bắt đầu:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.start_time).toLocaleString('vi-VN')}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Kết thúc:</Text>
          <Text style={styles.detailValue}>
            {item.end_time ? new Date(item.end_time).toLocaleString('vi-VN') : 'Đang bay...'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Độ cao tối đa:</Text>
          <Text style={styles.detailValue}>
            {item.max_altitude ? `${item.max_altitude} m` : 'N/A'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quãng đường:</Text>
          <Text style={styles.detailValue}>
            {item.distance ? `${item.distance} km` : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
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
            <Text style={styles.headerTitle}>Nhật Ký Chuyến Bay</Text>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'list' && styles.activeTabItem]}
              onPress={() => setActiveTab('list')}
            >
              <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
                Lịch sử chuyến bay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'add' && styles.activeTabItem]}
              onPress={() => setActiveTab('add')}
            >
              <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
                Ghi nhận chuyến mới
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'list' ? (
            loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0080FF" />
              </View>
            ) : (
              <FlatList
                data={logs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderLogItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Chưa có lịch sử chuyến bay nào</Text>
                  </View>
                }
              />
            )
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.formCard}>
                <Text style={styles.inputLabel}>Chọn thiết bị UAV bay *</Text>
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
                        {item.model_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Giấy phép bay (nếu có)</Text>
                <View style={styles.pickerGrid}>
                  {permits.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.pickerItem,
                        selectedPermitId === item.id && styles.pickerItemActive,
                      ]}
                      onPress={() => setSelectedPermitId(item.id)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedPermitId === item.id && styles.pickerItemTextActive,
                        ]}
                      >
                        GP-{item.id} ({item.purpose})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Thời gian bắt đầu *</Text>
                  <TextInput
                    style={styles.input}
                    value={startTime}
                    onChangeText={setStartTime}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Thời gian kết thúc</Text>
                  <TextInput
                    style={styles.input}
                    value={endTime}
                    onChangeText={setEndTime}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Độ cao tối đa (m)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ví dụ: 100"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={maxAltitude}
                      onChangeText={setMaxAltitude}
                    />
                  </View>
                  <View style={[styles.inputWrapper, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Quãng đường (km)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ví dụ: 2.5"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={distance}
                      onChangeText={setDistance}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, saveLoading && styles.submitBtnDisabled]}
                  onPress={handleSaveLog}
                  disabled={saveLoading}
                >
                  {saveLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>GHI NHẬN CHUYẾN BAY</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#0080FF',
  },
  tabText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0080FF',
  },
  loaderContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  serialText: {
    color: '#64748B',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  logDetails: {},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  detailValue: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
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
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
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
  row: {
    flexDirection: 'row',
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

export default FlightLogs;
