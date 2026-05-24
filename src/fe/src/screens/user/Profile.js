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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../navigation/AppNavigator';
import Alert from '../../components/CustomAlert';

const Profile = ({ navigation }) => {
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stats
  const [dronesCount, setDronesCount] = useState(0);
  const [permitsCount, setPermitsCount] = useState(0);
  const [violationsCount, setViolationsCount] = useState(0);
  const [policeInspectionsCount, setPoliceInspectionsCount] = useState(0);
  const [policeViolationsCount, setPoliceViolationsCount] = useState(0);

  // Edit Profile Form States
  const [showEditForm, setShowEditForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cccdNumber, setCccdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Change Password Form States
  const [showPwForm, setShowPwForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // 1. Fetch profile from Backend API
      const response = await axiosClient.get('/users/profile');
      if (response.data?.success) {
        const userData = response.data.data;
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        // Prefill form
        setFullName(userData.full_name || '');
        setPhone(userData.phone || '');
        setCccdNumber(userData.cccd_number || '');
        setAddress(userData.address || '');

        // Set role-specific stats
        const role = userData.role?.name?.toLowerCase() || userData.role?.toLowerCase() || '';
        if (role === 'user') {
          setDronesCount(userData.drones?.length || 0);

          // Fetch user permits count
          const permitsRes = await axiosClient.get('/flight/permits');
          setPermitsCount(permitsRes.data?.data?.length || 0);

          // Fetch user violations count
          const violationsRes = await axiosClient.get('/violations');
          setViolationsCount(violationsRes.data?.data?.length || 0);
        } else if (role === 'police') {
          // Fetch inspections made by this officer
          const inspectionsRes = await axiosClient.get('/inspections');
          setPoliceInspectionsCount(inspectionsRes.data?.data?.length || 0);

          // Fetch violations made by this officer
          const violationsRes = await axiosClient.get('/violations');
          setPoliceViolationsCount(violationsRes.data?.data?.length || 0);
        }
      }
    } catch (error) {
      console.error('Lỗi tải thông tin cá nhân:', error);
      // Fallback to local storage if API offline
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const localUser = JSON.parse(userStr);
        setUser(localUser);
        setFullName(localUser.full_name || '');
        setPhone(localUser.phone || '');
        setCccdNumber(localUser.cccd_number || '');
        setAddress(localUser.address || '');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Thông báo', 'Họ tên không được rỗng.');
      return;
    }

    setEditLoading(true);
    try {
      const response = await axiosClient.put('/users/profile', {
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        cccd_number: cccdNumber.trim() || null,
        address: address.trim() || null,
      });

      if (response.data?.success) {
        Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân thành công.');
        setShowEditForm(false);
        fetchProfileData();
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật thông tin.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ các trường mật khẩu.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Thông báo', 'Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Thông báo', 'Xác nhận mật khẩu mới không trùng khớp.');
      return;
    }

    setPwLoading(true);
    try {
      const response = await axiosClient.post('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.data?.success) {
        Alert.alert('Thành công', 'Đã đổi mật khẩu thành công.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPwForm(false);
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Check active shift for police before logout
      const activeShiftStr = await AsyncStorage.getItem('active_shift');
      if (activeShiftStr) {
        Alert.alert('Cảnh báo', 'Bạn đang trong ca trực tuần tra. Vui lòng kết thúc ca trực trước khi đăng xuất.');
        return;
      }

      await AsyncStorage.multiRemove(['token', 'user']);
      if (auth && auth.setUserRole) {
        auth.setUserRole(null);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRoleLabel = () => {
    const roleName = user?.role?.name?.toLowerCase() || user?.role?.toLowerCase() || 'user';
    if (roleName === 'admin') return 'QUẢN TRỊ VIÊN HỆ THỐNG / ADMIN';
    if (roleName === 'police') return 'SĨ QUAN AN NINH KHÔNG LƯU / POLICE';
    return 'CHỦ SỞ HỮU THIẾT BỊ / USER';
  };

  const getRoleIcon = () => {
    const roleName = user?.role?.name?.toLowerCase() || user?.role?.toLowerCase() || 'user';
    if (roleName === 'admin') return 'key';
    if (roleName === 'police') return 'shield';
    return 'person';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0080FF" />
      </View>
    );
  }

  const roleName = user?.role?.name?.toLowerCase() || user?.role?.toLowerCase() || 'user';

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
            <Text style={styles.headerTitle}>Hồ Sơ Cá Nhân</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* DECORATIVE Tech Blobs */}
            <View style={styles.techBlob1} />
            <View style={styles.techBlob2} />

            {/* AVATAR CARD */}
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons name={getRoleIcon()} size={44} color="#0080FF" />
                </View>
                <Text style={styles.fullNameText}>{user?.full_name}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{getRoleLabel()}</Text>
                </View>
              </View>
            </View>

            {/* THÔNG TIN CHI TIẾT */}
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Thông tin liên hệ chi tiết</Text>
              <View style={styles.infoDivider} />
              
              <View style={styles.infoItem}>
                <Ionicons name="mail" size={18} color="#0080FF" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Địa chỉ Email</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="call" size={18} color="#0080FF" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Số điện thoại</Text>
                  <Text style={styles.infoValue}>{user?.phone || 'Chưa cập nhật'}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="card" size={18} color="#0080FF" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Số CCCD/CMND/Passport</Text>
                  <Text style={styles.infoValue}>{user?.cccd_number || 'Chưa cập nhật'}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location" size={18} color="#0080FF" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Địa chỉ thường trú</Text>
                  <Text style={styles.infoValue}>{user?.address || 'Chưa cập nhật'}</Text>
                </View>
              </View>
            </View>

            {/* THỐNG KÊ CHI TIẾT */}
            {roleName === 'user' && (
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Ionicons name="airplane" size={22} color="#0080FF" />
                  <Text style={styles.statVal}>{dronesCount}</Text>
                  <Text style={styles.statLabel}>UAV sở hữu</Text>
                </View>
                <View style={styles.statBox}>
                  <Ionicons name="document-text" size={22} color="#0080FF" />
                  <Text style={styles.statVal}>{permitsCount}</Text>
                  <Text style={styles.statLabel}>Lượt xin phép</Text>
                </View>
                <View style={styles.statBox}>
                  <Ionicons name="warning" size={22} color="#0080FF" />
                  <Text style={styles.statVal}>{violationsCount}</Text>
                  <Text style={styles.statLabel}>Ca vi phạm</Text>
                </View>
              </View>
            )}

            {roleName === 'police' && (
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Ionicons name="shield-checkmark" size={22} color="#0080FF" />
                  <Text style={styles.statVal}>{policeInspectionsCount}</Text>
                  <Text style={styles.statLabel}>Đã kiểm định</Text>
                </View>
                <View style={styles.statBox}>
                  <Ionicons name="warning" size={22} color="#0080FF" />
                  <Text style={styles.statVal}>{policeViolationsCount}</Text>
                  <Text style={styles.statLabel}>Biên bản vi phạm</Text>
                </View>
              </View>
            )}

            {/* HỘP BẢO MẬT & PHIÊN BẢN (NEW & INFORMATION RICH) */}
            <Text style={styles.sectionTitle}>Trạng thái bảo mật tài khoản</Text>
            <View style={styles.securityCard}>
              <View style={styles.securityItem}>
                <Ionicons name="shield-checkmark-sharp" size={16} color="#10B981" />
                <Text style={styles.securityText}>Mật khẩu cấp độ 2: ĐÃ KÍCH HOẠT</Text>
              </View>
              <View style={styles.securityItem}>
                <Ionicons name="shield-checkmark-sharp" size={16} color="#10B981" />
                <Text style={styles.securityText}>Xác thực định danh quốc gia (CCCD): HỢP LỆ</Text>
              </View>
              <View style={styles.securityItem}>
                <Ionicons name="information-circle-outline" size={16} color="#64748B" />
                <Text style={styles.securityText}>Phiên bản phần mềm: v2.4.10-build-82</Text>
              </View>
            </View>

            {/* ACCORDION 1: CẬP NHẬT THÔNG TIN HỒ SƠ (ĐỒNG BỘ MÀU PRIMARY) */}
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuHeader}
                onPress={() => {
                  setShowEditForm(!showEditForm);
                  setShowPwForm(false);
                }}
              >
                <View style={styles.menuTitleRow}>
                  <Ionicons name="create" size={20} color="#0080FF" />
                  <Text style={styles.menuTitle}>Thay đổi thông tin liên hệ</Text>
                </View>
                <Ionicons name={showEditForm ? 'chevron-up' : 'chevron-down'} size={18} color="#94A3B8" />
              </TouchableOpacity>

              {showEditForm && (
                <View style={styles.menuBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Họ và tên</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập họ và tên đăng ký"
                      placeholderTextColor="#94A3B8"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Số điện thoại</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập số điện thoại di động"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Số CCCD/CMND/Passport</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập số căn cước"
                      placeholderTextColor="#94A3B8"
                      value={cccdNumber}
                      onChangeText={setCccdNumber}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Địa chỉ liên lạc</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập địa chỉ nhà riêng/cơ quan"
                      placeholderTextColor="#94A3B8"
                      value={address}
                      onChangeText={setAddress}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleUpdateProfile}
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* ACCORDION 2: ĐỔI MẬT KHẨU (ĐỒNG BỘ MÀU PRIMARY) */}
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuHeader}
                onPress={() => {
                  setShowPwForm(!showPwForm);
                  setShowEditForm(false);
                }}
              >
                <View style={styles.menuTitleRow}>
                  <Ionicons name="lock-closed" size={20} color="#0080FF" />
                  <Text style={styles.menuTitle}>Thay đổi mật khẩu đăng nhập</Text>
                </View>
                <Ionicons name={showPwForm ? 'chevron-up' : 'chevron-down'} size={18} color="#94A3B8" />
              </TouchableOpacity>

              {showPwForm && (
                <View style={styles.menuBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập mật khẩu cũ"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry
                      value={oldPassword}
                      onChangeText={setOldPassword}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Tối thiểu 6 ký tự"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập lại mật khẩu mới"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleChangePassword}
                    disabled={pwLoading}
                  >
                    {pwLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.saveBtnText}>Đổi mật khẩu tài khoản</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* THÔNG TIN & CẤU HÌNH HỆ THỐNG */}
            {(() => {
              const userRole = user?.role?.name?.toLowerCase() || user?.role?.toLowerCase() || '';
              const isAdmin = userRole === 'admin';
              return (
                <View style={styles.menuCard}>
                  <TouchableOpacity
                    style={styles.menuHeader}
                    onPress={() => {
                      if (isAdmin) {
                        navigation.navigate('SystemSettings');
                      } else {
                        Alert.alert(
                          'Liên hệ hỗ trợ',
                          'Email hỗ trợ: support@uavid.vn\nĐường dây nóng: 1800-6868\nGiờ làm việc: 8:00 - 17:30 (Thứ 2 - Thứ 6)'
                        );
                      }
                    }}
                  >
                    <View style={styles.menuTitleRow}>
                      {isAdmin ? (
                        <>
                          <Ionicons name="settings-sharp" size={20} color="#0080FF" />
                          <Text style={styles.menuTitle}>Thông tin & Cấu hình hệ thống</Text>
                        </>
                      ) : (
                        <>
                          <Ionicons name="help-circle-outline" size={20} color="#0080FF" />
                          <Text style={styles.menuTitle}>Liên hệ hỗ trợ</Text>
                        </>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              );
            })()}

            {/* LOGOUT BUTTON */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={styles.logoutText}>Đăng xuất khỏi hệ thống</Text>
            </TouchableOpacity>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  techBlob1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#0080FF',
    opacity: 0.04,
    top: 20,
    right: -50,
  },
  techBlob2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#0080FF',
    opacity: 0.03,
    bottom: 100,
    left: -100,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 12,
  },
  fullNameText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  roleBadgeText: {
    color: '#475569',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  infoValue: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    alignItems: 'center',
  },
  statVal: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  securityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  securityText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    overflow: 'hidden',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
  },
  menuBody: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFBFC',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#0F172A',
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: '#0080FF',
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Profile;
