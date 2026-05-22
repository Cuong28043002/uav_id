import React, { useState, useEffect } from 'react';
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
  ScrollView,
  ImageBackground,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../navigation/AppNavigator';

const settingLabels = {
  max_drone_per_user: 'Số drone tối đa/Người dùng',
  otp_expires_minutes: 'Thời gian hiệu lực OTP (phút)',
  registration_auto_approve: 'Tự động phê duyệt hồ sơ',
  max_altitude_default: 'Độ cao bay tối đa mặc định (m)',
  contact_email: 'Email hỗ trợ kỹ thuật',
};

const SystemSettings = ({ navigation }) => {
  const auth = useAuth();
  const userRole = auth?.userRole;
  const roleName = typeof userRole === 'object' ? userRole?.name : userRole;
  const isAdmin = roleName?.toLowerCase() === 'admin';

  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  const [settingKey, setSettingKey] = useState('');
  const [settingVal, setSettingVal] = useState('');
  const [settingDesc, setSettingDesc] = useState('');
  const [editingSettingId, setEditingSettingId] = useState(null);
  const [showSettingForm, setShowSettingForm] = useState(false);

  const [mName, setMName] = useState('');
  const [mCountry, setMCountry] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [editingMId, setEditingMId] = useState(null);
  const [showMForm, setShowMForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'settings') {
        const response = await axiosClient.get('/settings');
        setSettings(response.data?.data || []);
      } else {
        const response = await axiosClient.get('/manufacturers');
        setManufacturers(response.data?.data || []);
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

  const handleSaveSetting = async () => {
    if (!settingKey.trim() || !settingVal.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Tên và Giá trị cài đặt.');
      return;
    }

    try {
      const response = await axiosClient.post('/settings', {
        key_name: settingKey.trim(),
        key_value: settingVal.trim(),
        description: settingDesc.trim(),
      });

      if (response.data?.success) {
        Alert.alert('Thành công', 'Lưu cài đặt thành công!');
        setSettingKey('');
        setSettingVal('');
        setSettingDesc('');
        setEditingSettingId(null);
        setShowSettingForm(false);
        fetchData();
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu cấu hình.');
    }
  };

  const handleDeleteSetting = async (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa cài đặt này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosClient.delete(`/settings/${id}`);
            setSettings((prev) => prev.filter((item) => item.id !== id));
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa cài đặt.');
          }
        },
      },
    ]);
  };

  const handleSaveManufacturer = async () => {
    if (!mName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nhà sản xuất.');
      return;
    }

    try {
      let response;
      if (editingMId) {
        response = await axiosClient.put(`/manufacturers/${editingMId}`, {
          name: mName.trim(),
          support_email: mEmail.trim() || null,
        });
      } else {
        response = await axiosClient.post('/manufacturers', {
          name: mName.trim(),
          country: mCountry.trim() || null,
          support_email: mEmail.trim() || null,
        });
      }

      if (response.data?.success) {
        Alert.alert('Thành công', 'Lưu thông tin nhà sản xuất thành công!');
        setMName('');
        setMCountry('');
        setMEmail('');
        setEditingMId(null);
        setShowMForm(false);
        fetchData();
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu nhà sản xuất.');
    }
  };

  const handleDeleteManufacturer = async (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa nhà sản xuất này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosClient.delete(`/manufacturers/${id}`);
            setManufacturers((prev) => prev.filter((item) => item.id !== id));
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa nhà sản xuất.');
          }
        },
      },
    ]);
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
            <Text style={styles.headerTitle}>{isAdmin ? 'Cấu Hình Hệ Thống' : 'Hỗ Trợ & Liên Hệ'}</Text>
          </View>

          {isAdmin && (
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'settings' && styles.activeTabItem]}
                onPress={() => setActiveTab('settings')}
              >
                <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
                  Tham số hệ thống
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'manufacturers' && styles.activeTabItem]}
                onPress={() => setActiveTab('manufacturers')}
              >
                <Text style={[styles.tabText, activeTab === 'manufacturers' && styles.activeTabText]}>
                  Nhà sản xuất
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {activeTab === 'settings' && (
              <View>
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      setShowSettingForm(!showSettingForm);
                      setEditingSettingId(null);
                      setSettingKey('');
                      setSettingVal('');
                      setSettingDesc('');
                    }}
                  >
                    <Ionicons name={showSettingForm ? 'close' : 'add'} size={20} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>
                      {showSettingForm ? 'Đóng form nhập' : 'Thêm tham số hệ thống'}
                    </Text>
                  </TouchableOpacity>
                )}

                {isAdmin && showSettingForm && (
                  <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>
                      {editingSettingId ? 'Cập nhật tham số' : 'Tạo tham số mới'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Mã tham số (vd: max_weight_limit)"
                      placeholderTextColor="#94A3B8"
                      value={settingKey}
                      onChangeText={setSettingKey}
                      editable={!editingSettingId}
                    />
                    {settingKey === 'registration_auto_approve' || settingVal === 'true' || settingVal === 'false' ? (
                      <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Trạng thái kích hoạt:</Text>
                        <Switch
                          value={settingVal === 'true'}
                          onValueChange={(val) => setSettingVal(val ? 'true' : 'false')}
                          trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                          thumbColor={settingVal === 'true' ? '#0080FF' : '#F1F5F9'}
                        />
                      </View>
                    ) : (
                      <TextInput
                        style={styles.input}
                        placeholder="Giá trị thiết lập"
                        placeholderTextColor="#94A3B8"
                        value={settingVal}
                        onChangeText={setSettingVal}
                      />
                    )}
                    <TextInput
                      style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                      placeholder="Mô tả tham số..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      value={settingDesc}
                      onChangeText={setSettingDesc}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveSetting}>
                      <Text style={styles.saveButtonText}>Lưu thiết lập</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {loading ? (
                  <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 40 }} />
                ) : (
                  settings
                    .filter((item) => isAdmin || item.key_name === 'contact_email')
                    .map((item) => {
                      const isBool = item.key_value === 'true' || item.key_value === 'false';
                      return (
                        <View key={item.id} style={styles.card}>
                          <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{settingLabels[item.key_name] || item.key_name}</Text>
                            {isAdmin && <Text style={styles.cardSystemKey}>Mã hệ thống: {item.key_name}</Text>}
                          
                          <View style={styles.settingRow}>
                            {isBool ? (
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Switch
                                  value={item.key_value === 'true'}
                                  onValueChange={async (newValue) => {
                                    if (!isAdmin) return;
                                    try {
                                      const updatedVal = newValue ? 'true' : 'false';
                                      await axiosClient.post('/settings', {
                                        key_name: item.key_name,
                                        key_value: updatedVal,
                                        description: item.description || ''
                                      });
                                      fetchData();
                                    } catch (err) {
                                      Alert.alert('Lỗi', 'Không thể cập nhật cấu hình');
                                    }
                                  }}
                                  disabled={!isAdmin}
                                  trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                                  thumbColor={item.key_value === 'true' ? '#0080FF' : '#F1F5F9'}
                                />
                                <Text style={[styles.switchStatusText, { color: item.key_value === 'true' ? '#10B981' : '#64748B' }]}>
                                  {item.key_value === 'true' ? ' Đang bật' : ' Đang tắt'}
                                </Text>
                              </View>
                            ) : (
                              <Text style={styles.cardValue}>
                                {item.key_name === 'max_drone_per_user' ? `${item.key_value} thiết bị` : 
                                 item.key_name === 'otp_expires_minutes' ? `${item.key_value} phút` : 
                                 item.key_name === 'max_altitude_default' ? `${item.key_value} mét` : 
                                 item.key_value}
                              </Text>
                            )}
                          </View>
                          {item.description && (
                            <Text style={styles.cardDesc}>{item.description}</Text>
                          )}
                        </View>
                        {isAdmin && (
                          <View style={styles.cardActions}>
                            <TouchableOpacity
                              style={styles.actionBtn}
                              onPress={() => {
                                setEditingSettingId(item.id);
                                setSettingKey(item.key_name);
                                setSettingVal(item.key_value);
                                setSettingDesc(item.description || '');
                                setShowSettingForm(true);
                              }}
                            >
                              <Ionicons name="create-outline" size={18} color="#0080FF" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.actionBtn}
                              onPress={() => handleDeleteSetting(item.id)}
                            >
                              <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })
                )}
              </View>
            )}

            {activeTab === 'manufacturers' && (
              <View>
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      setShowMForm(!showMForm);
                      setEditingMId(null);
                      setMName('');
                      setMCountry('');
                      setMEmail('');
                    }}
                  >
                    <Ionicons name={showMForm ? 'close' : 'add'} size={20} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>
                      {showMForm ? 'Đóng form nhập' : 'Thêm nhà sản xuất'}
                    </Text>
                  </TouchableOpacity>
                )}

                {isAdmin && showMForm && (
                  <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>
                      {editingMId ? 'Cập nhật nhà sản xuất' : 'Thêm nhà sản xuất mới'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Tên nhà sản xuất (vd: DJI)"
                      placeholderTextColor="#94A3B8"
                      value={mName}
                      onChangeText={setMName}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Quốc gia (vd: China)"
                      placeholderTextColor="#94A3B8"
                      value={mCountry}
                      onChangeText={setMCountry}
                      editable={!editingMId}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email hỗ trợ (support@dji.com)"
                      placeholderTextColor="#94A3B8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={mEmail}
                      onChangeText={setMEmail}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveManufacturer}>
                      <Text style={styles.saveButtonText}>Lưu thông tin</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {loading ? (
                  <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 40 }} />
                ) : (
                  manufacturers.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardDesc}>Quốc gia: {item.country || 'N/A'}</Text>
                        {item.support_email && (
                          <Text style={styles.cardDesc}>Email: {item.support_email}</Text>
                        )}
                      </View>
                      {isAdmin && (
                        <View style={styles.cardActions}>
                          <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => {
                              setEditingMId(item.id);
                              setMName(item.name);
                              setMCountry(item.country || '');
                              setMEmail(item.support_email || '');
                              setShowMForm(true);
                            }}
                          >
                            <Ionicons name="create-outline" size={18} color="#0080FF" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => handleDeleteManufacturer(item.id)}
                          >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0080FF',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#0080FF',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardValue: {
    color: '#0080FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  cardDesc: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  cardSystemKey: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  settingRow: {
    marginTop: 8,
    marginBottom: 4,
  },
  switchStatusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
});

export default SystemSettings;
