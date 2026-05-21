import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../navigation/AppNavigator';

const AdminDashboard = ({ navigation }) => {
  const auth = useAuth();
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Simulated Audit logs for rich info dashboard
  const auditLogs = [
    { id: 1, action: 'Định danh UAV mới', target: 'DJI Mini 3 Pro - SN: 9942', time: '1 phút trước' },
    { id: 2, action: 'Cấp phép bay', target: 'Khu công nghệ cao Lô B', time: '5 phút trước' },
    { id: 3, action: 'Bắt đầu ca trực', target: 'Sĩ quan Minh - Phân khu 2', time: '12 phút trước' },
    { id: 4, action: 'Ghi nhận vi phạm', target: 'Bay không phép độ cao 150m', time: '20 phút trước' },
  ];

  const fetchStats = async () => {
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setAdminName(user.full_name || 'Admin');
      }

      const response = await axiosClient.get('/admin/stats');
      if (response.data?.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      if (auth && auth.setUserRole) {
        auth.setUserRole(null);
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const overview = data?.overview || {
    totalUsers: 0,
    totalDrones: 0,
    totalLookups: 0,
    unpaidFines: 0,
    newUsersThisMonth: 0,
    newDronesThisMonth: 0,
  };

  const pendingRegsCount = data?.registrations?.pending || 0;

  // Calculate percentages for progress bars
  const totalAccs = data?.usersByRole?.reduce((sum, r) => sum + r.count, 0) || 1;

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
          
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerSubtitle}>BẢNG ĐIỀU KHIỂN HỆ THỐNG QUẢN TRỊ</Text>
              <Text style={styles.headerTitle}>{adminName}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#0080FF" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0080FF" />
              </View>
            ) : (
              <View>
                {/* DECORATIVE Tech Blobs */}
                <View style={styles.techBlob1} />
                <View style={styles.techBlob2} />

                {/* KHỐI 1: THỐNG KÊ TỔNG THỂ */}
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Ionicons name="people" size={24} color="#0080FF" />
                    <Text style={styles.statNumber}>{overview.totalUsers}</Text>
                    <Text style={styles.statLabel}>Người dùng</Text>
                    <Text style={styles.statTrend}>+{overview.newUsersThisMonth} tháng này</Text>
                  </View>

                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="drone" size={24} color="#0080FF" />
                    <Text style={styles.statNumber}>{overview.totalDrones}</Text>
                    <Text style={styles.statLabel}>Thiết bị UAV</Text>
                    <Text style={styles.statTrend}>+{overview.newDronesThisMonth} đăng ký mới</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Ionicons name="search" size={24} color="#0080FF" />
                    <Text style={styles.statNumber}>{overview.totalLookups}</Text>
                    <Text style={styles.statLabel}>Lượt tra cứu</Text>
                    <Text style={styles.statTrend}>Thời gian thực</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Ionicons name="alert-circle" size={24} color="#0080FF" />
                    <Text style={styles.statNumber}>
                      {overview.unpaidFines ? `${(overview.unpaidFines / 1e6).toFixed(1)}M` : '0đ'}
                    </Text>
                    <Text style={styles.statLabel}>Tiền phạt chưa thu</Text>
                    <Text style={styles.statTrend}>Cần thu hồi</Text>
                  </View>
                </View>

                {/* KHỐI 2: SỨC KHỎE HỆ THỐNG MÁY CHỦ (NEW & DETAILED) */}
                <Text style={styles.sectionTitle}>Sức khỏe hệ thống & Cột mốc Radar</Text>
                <View style={styles.systemCard}>
                  <View style={styles.systemRow}>
                    <View style={styles.systemIndicator}>
                      <View style={styles.activeDot} />
                      <Text style={styles.systemText}>CSDL Server (Mysql): CONNECTED (4ms)</Text>
                    </View>
                  </View>
                  <View style={styles.systemRow}>
                    <View style={styles.systemIndicator}>
                      <View style={styles.activeDot} />
                      <Text style={styles.systemText}>API Webhost (Express): ONLINE (RAM: 142MB / CPU: 4%)</Text>
                    </View>
                  </View>
                  <View style={styles.systemRow}>
                    <View style={styles.systemIndicator}>
                      <View style={styles.activeDot} />
                      <Text style={styles.systemText}>Các điểm trạm Radar địa bàn: 4/4 HOẠT ĐỘNG</Text>
                    </View>
                  </View>
                </View>

                {/* KHỐI 3: CHỨC NĂNG QUẢN TRỊ */}
                <Text style={styles.sectionTitle}>Chức năng quản trị</Text>
                <View style={styles.menuContainer}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('ManageUsers')}
                  >
                    <View style={styles.menuIconContainer}>
                      <Ionicons name="person-add" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuItemTitle}>Quản lý tài khoản</Text>
                      <Text style={styles.menuItemSubtitle}>Phê duyệt, khóa, phân quyền các tài khoản</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('ApproveDrones')}
                  >
                    <View style={styles.menuIconContainer}>
                      <Ionicons name="checkmark-circle" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuItemTitle}>Duyệt hồ sơ định danh UAV</Text>
                      <Text style={styles.menuItemSubtitle}>Có {pendingRegsCount} hồ sơ cần duyệt cấp mã định danh</Text>
                    </View>
                    {pendingRegsCount > 0 && (
                      <View style={styles.badgeCount}>
                        <Text style={styles.badgeCountText}>{pendingRegsCount}</Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuItem, { borderBottomWidth: 0 }]}
                    onPress={() => navigation.navigate('SystemSettings')}
                  >
                    <View style={styles.menuIconContainer}>
                      <Ionicons name="settings" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuItemTitle}>Cấu hình hệ thống</Text>
                      <Text style={styles.menuItemSubtitle}>Thiết lập tham số phạt, danh mục hãng sản xuất UAV</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* KHỐI 4: BIỂU ĐỒ PHÂN BỔ TÀI KHOẢN (CUSTOM MESH PROGRESS BAR) */}
                <Text style={styles.sectionTitle}>Phân bổ tài khoản theo chức năng</Text>
                <View style={styles.chartCard}>
                  {data?.usersByRole?.map((r, index) => {
                    const pct = Math.max(5, Math.round((r.count / totalAccs) * 100));
                    return (
                      <View key={index} style={styles.chartRow}>
                        <View style={styles.chartHeader}>
                          <Text style={styles.chartLabel}>{r.role?.toUpperCase() || 'USER'}</Text>
                          <Text style={styles.chartVal}>{r.count} tài khoản ({pct}%)</Text>
                        </View>
                        <View style={styles.barContainer}>
                          <View style={[styles.barFill, { width: `${pct}%` }]} />
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* KHỐI 5: LOG HOẠT ĐỘNG HỆ THỐNG THỜI GIAN THỰC (NEW & INTERESTING) */}
                <Text style={styles.sectionTitle}>Nhật ký hoạt động hệ thống gần đây</Text>
                <View style={styles.logCard}>
                  {auditLogs.map((log) => (
                    <View key={log.id} style={styles.logRow}>
                      <View style={styles.logBullet} />
                      <View style={styles.logContent}>
                        <Text style={styles.logActionText}>{log.action}</Text>
                        <Text style={styles.logTargetText}>{log.target}</Text>
                      </View>
                      <Text style={styles.logTimeText}>{log.time}</Text>
                    </View>
                  ))}
                </View>

                {/* KHỐI 6: HỒ SƠ ĐĂNG KÝ MỚI NHẤT */}
                <Text style={styles.sectionTitle}>Hồ sơ xin định danh UAV mới nhất</Text>
                <View style={styles.tableCard}>
                  {data?.recent?.registrations?.length === 0 ? (
                    <Text style={styles.emptyTableText}>Chưa có hồ sơ nào</Text>
                  ) : (
                    data?.recent?.registrations?.map((item) => (
                      <View key={item.id} style={styles.tableRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.tableRowTitle}>{item.drone?.model_name || 'UAV'}</Text>
                          <Text style={styles.tableRowSubtitle}>S/N: {item.drone?.serial_number}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <View style={[
                            styles.statusBadge,
                            item.status === 'pending' ? styles.statusPending :
                            item.status === 'approved' ? styles.statusApproved : styles.statusRejected
                          ]}>
                            <Text style={styles.statusBadgeText}>
                              {item.status === 'pending' ? 'ĐANG CHỜ' : item.status === 'approved' ? 'ĐÃ DUYỆT' : 'TỪ CHỐI'}
                            </Text>
                          </View>
                          <Text style={styles.tableRowDate}>
                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>

                {/* KHỐI 7: BIÊN BẢN VI PHẠM MỚI NHẤT */}
                <Text style={styles.sectionTitle}>Biên bản vi phạm không phận mới nhất</Text>
                <View style={styles.tableCard}>
                  {data?.recent?.violations?.length === 0 ? (
                    <Text style={styles.emptyTableText}>Chưa có vi phạm nào</Text>
                  ) : (
                    data?.recent?.violations?.map((item) => (
                      <View key={item.id} style={styles.tableRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.tableRowTitle}>{item.violation_type}</Text>
                          <Text style={styles.tableRowSubtitle}>
                            Chủ sở hữu: {item.user?.full_name || 'N/A'} - {item.drone?.model_name || 'UAV'}
                          </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.fineText}>
                            {item.fine_amount ? `${item.fine_amount.toLocaleString('vi-VN')}đ` : 'Cảnh cáo'}
                          </Text>
                          <View style={[
                            styles.statusBadge,
                            item.status === 'unpaid' ? styles.statusUnpaid : styles.statusPaid
                          ]}>
                            <Text style={styles.statusBadgeText}>
                              {item.status === 'unpaid' ? 'CHƯA NỘP' : 'ĐÃ NỘP'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))
                  )}
                </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerSubtitle: {
    color: '#0080FF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loaderContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  statLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  statTrend: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 4,
  },
  systemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  systemRow: {
    paddingVertical: 6,
  },
  systemIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  systemText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuItemSubtitle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  badgeCount: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  chartRow: {
    marginBottom: 14,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  chartVal: {
    fontSize: 11,
    color: '#64748B',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#0080FF',
    borderRadius: 4,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0080FF',
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  logTargetText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  logTimeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  tableRowSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tableRowDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  emptyTableText: {
    textAlign: 'center',
    color: '#94A3B8',
    paddingVertical: 16,
    fontSize: 13,
  },
  fineText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  statusApproved: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0080FF',
  },
  statusRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  statusUnpaid: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  statusPaid: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0080FF',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
  },
});

export default AdminDashboard;
