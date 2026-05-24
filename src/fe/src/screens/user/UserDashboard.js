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

const UserDashboard = ({ navigation }) => {
  const auth = useAuth();
  const [userName, setUserName] = useState('Người dùng');
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    drones: 0,
    permits: 0,
    violations: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);

  // Pre-flight checklist state
  const [checks, setChecks] = useState({
    battery: true,
    gps: true,
    firmware: false,
    permit: true,
  });

  const toggleCheck = (key) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const loadData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.full_name || 'Người dùng');
      }

      const [dronesRes, permitsRes, violationsRes, logsRes] = await Promise.all([
        axiosClient.get('/drones'),
        axiosClient.get('/flight/permits'),
        axiosClient.get('/violations?status=unpaid'),
        axiosClient.get('/flight/logs?limit=3'),
      ]);

      setCounts({
        drones: dronesRes.data?.data?.length || 0,
        permits: permitsRes.data?.data?.length || 0,
        violations: violationsRes.data?.data?.length || 0,
      });

      setRecentLogs(logsRes.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

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
              <Text style={styles.headerSubtitle}>HỆ THỐNG ĐỊNH DANH UAV</Text>
              <Text style={styles.headerTitle}>Chào, {userName}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionIcon}
                onPress={() => navigation.navigate('NotificationsScreen')}
              >
                <Ionicons name="notifications-outline" size={22} color="#0080FF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionIcon, { marginLeft: 10 }]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="#0080FF" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {loading ? (
              <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 100 }} />
            ) : (
              <View>
                {/* DECORATIVE Tech Blobs */}
                <View style={styles.techBlob1} />
                <View style={styles.techBlob2} />

                {/* KHỐI 1: TRẠNG THÁI MÔI TRƯỜNG & LIÊN KẾT THỜI GIAN THỰC */}
                <View style={styles.weatherCard}>
                  <View style={styles.weatherHeader}>
                    <Text style={styles.weatherTitle}>LIÊN KẾT THỜI GIAN THỰC (GPS/RADAR)</Text>
                    <View style={styles.statusDotRow}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusDotText}>ONLINE</Text>
                    </View>
                  </View>
                  <View style={styles.weatherMetrics}>
                    <View style={styles.metricItem}>
                      <Ionicons name="sunny" size={22} color="#0080FF" />
                      <Text style={styles.metricVal}>31°C - Nắng</Text>
                      <Text style={styles.metricLabel}>Môi trường</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Ionicons name="speedometer-outline" size={22} color="#0080FF" />
                      <Text style={styles.metricVal}>3.2 m/s</Text>
                      <Text style={styles.metricLabel}>Tốc độ gió</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Ionicons name="wifi" size={22} color="#0080FF" />
                      <Text style={styles.metricVal}>5.8 GHz</Text>
                      <Text style={styles.metricLabel}>Băng tần bay</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Ionicons name="locate" size={22} color="#0080FF" />
                      <Text style={styles.metricVal}>18 Sats</Text>
                      <Text style={styles.metricLabel}>Vệ tinh</Text>
                    </View>
                  </View>
                </View>

                {/* KHỐI 2: CÁC CARD SỐ LIỆU THỐNG KÊ (ĐỒNG BỘ MÀU CHỦ ĐẠO) */}
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <MaterialCommunityIcons name="drone" size={24} color="#0080FF" />
                      <Text style={styles.statNumber}>{counts.drones}</Text>
                    </View>
                    <Text style={styles.statLabel}>Thiết bị sở hữu</Text>
                  </View>

                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Ionicons name="paper-plane" size={24} color="#0080FF" />
                      <Text style={styles.statNumber}>{counts.permits}</Text>
                    </View>
                    <Text style={styles.statLabel}>Giấy phép đã yêu cầu</Text>
                  </View>


                  <TouchableOpacity
                    style={[styles.statCard, { width: '100%' }]}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('MyViolations')}
                  >
                    <View style={styles.statHeader}>
                      <Ionicons name="warning" size={24} color={counts.violations > 0 ? '#EF4444' : '#0080FF'} />
                      <Text style={[styles.statNumber, counts.violations > 0 && { color: '#EF4444' }]}>{counts.violations}</Text>
                    </View>
                    <Text style={styles.statLabel}>Biên bản vi phạm chưa xử lý (Nhấp để nộp phạt)</Text>
                  </TouchableOpacity>
                </View>

                {/* KHỐI 3: CHECKLIST CHUẨN BỊ TRƯỚC KHI CẤT CÁNH (PRE-FLIGHT) */}
                <Text style={styles.sectionTitle}>Quy trình kiểm tra an toàn bay (Pre-flight Checklist)</Text>
                <View style={styles.checklistCard}>
                  <TouchableOpacity style={styles.checkRow} onPress={() => toggleCheck('battery')}>
                    <Ionicons
                      name={checks.battery ? 'checkbox' : 'square-outline'}
                      size={20}
                      color="#0080FF"
                    />
                    <Text style={[styles.checkText, checks.battery && styles.checkedText]}>
                      Pin thiết bị bay và tay điều khiển trên 80%
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.checkRow} onPress={() => toggleCheck('gps')}>
                    <Ionicons
                      name={checks.gps ? 'checkbox' : 'square-outline'}
                      size={20}
                      color="#0080FF"
                    />
                    <Text style={[styles.checkText, checks.gps && styles.checkedText]}>
                      Hệ thống định vị GPS nhận trên 12 vệ tinh kết nối ổn định
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.checkRow} onPress={() => toggleCheck('firmware')}>
                    <Ionicons
                      name={checks.firmware ? 'checkbox' : 'square-outline'}
                      size={20}
                      color="#0080FF"
                    />
                    <Text style={[styles.checkText, checks.firmware && styles.checkedText]}>
                      Cập nhật bản đồ không phận & Firmware UAV mới nhất
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.checkRow} onPress={() => toggleCheck('permit')}>
                    <Ionicons
                      name={checks.permit ? 'checkbox' : 'square-outline'}
                      size={20}
                      color="#0080FF"
                    />
                    <Text style={[styles.checkText, checks.permit && styles.checkedText]}>
                      Đã xin cấp phép bay hợp lệ và trong khung giờ hoạt động cho phép
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* KHỐI 4: MENU TÍNH NĂNG CHÍNH */}
                <Text style={styles.sectionTitle}>Chức năng dịch vụ UAV</Text>
                <View style={styles.menuContainer}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('MyDrones')}
                  >
                    <View style={styles.iconBox}>
                      <MaterialCommunityIcons name="drone" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>Danh sách UAV của tôi</Text>
                      <Text style={styles.menuDesc}>Xem mã định danh, xuất mã QR định danh thiết bị</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('RegisterDrone')}
                  >
                    <View style={styles.iconBox}>
                      <Ionicons name="add-circle" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>Đăng ký định danh UAV mới</Text>
                      <Text style={styles.menuDesc}>Khai báo đăng kiểm, gửi hồ sơ xin cấp biển định danh</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('RequestFlight')}
                  >
                    <View style={styles.iconBox}>
                      <Ionicons name="paper-plane" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>Đăng ký xin phép bay</Text>
                      <Text style={styles.menuDesc}>Nộp hồ sơ xin phép hoạt động trong phân khu và khung giờ</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('FlightLogs')}
                  >
                    <View style={styles.iconBox}>
                      <Ionicons name="journal" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>Nhật ký hành trình bay</Text>
                      <Text style={styles.menuDesc}>Xem lịch sử bay thực tế, độ cao, quãng đường di chuyển</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('LiveFlight')}
                  >
                    <View style={styles.iconBox}>
                      <Ionicons name="airplane-sharp" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>Giám sát chuyến bay thực địa</Text>
                      <Text style={styles.menuDesc}>Kết nối thời gian thực, mô phỏng đo đạc độ cao và lưu hành trình</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuItem, { borderBottomWidth: 0 }]}
                    onPress={() => navigation.navigate('MyViolations')}
                  >
                    <View style={styles.iconBox}>
                      <Ionicons name="alert-circle" size={20} color="#0080FF" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>Biên bản vi phạm & Nộp phạt</Text>
                      <Text style={styles.menuDesc}>Tra cứu các hóa đơn phạt hành chính chưa thanh toán</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* KHỐI 5: NHẬT KÝ CHUYẾN BAY GẦN ĐÂY */}
                <View style={styles.blockHeaderRow}>
                  <Text style={styles.sectionTitle}>Chuyến bay gần đây</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('FlightLogs')}>
                    <Text style={styles.viewMoreText}>Xem tất cả</Text>
                  </TouchableOpacity>
                </View>
                {recentLogs.length === 0 ? (
                  <View style={styles.emptyRecentCard}>
                    <Text style={styles.emptyRecentText}>Chưa ghi nhận lịch sử chuyến bay nào.</Text>
                  </View>
                ) : (
                  recentLogs.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.recentLogCard}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (item.drone_id) {
                          navigation.navigate('DroneDetail', { droneId: item.drone_id });
                        }
                      }}
                    >
                      <View style={styles.recentLogMain}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.recentLogModel}>{item.drone?.model_name || 'UAV device'}</Text>
                          <Text style={styles.recentLogTime}>
                            {new Date(item.start_time).toLocaleDateString('vi-VN')} •{' '}
                            {new Date(item.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </View>
                        <View style={styles.recentLogRight}>
                          <Text style={styles.recentLogValue}>{item.distance ? `${item.distance} km` : 'N/A'}</Text>
                          <Text style={styles.recentLogLabel}>Quãng đường</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}

                {/* KHỐI 6: QUY ĐỊNH & THAM CHIẾU VÙNG CẤM BAY HÔM NAY */}
                <Text style={styles.sectionTitle}>Quy định bay quan trọng</Text>
                <View style={styles.ruleCard}>
                  <View style={styles.ruleItem}>
                    <View style={[styles.ruleIndicator, { backgroundColor: '#EF4444' }]} />
                    <View style={styles.ruleContent}>
                      <Text style={styles.ruleName}>Vùng cấm bay (Forbidden Zone)</Text>
                      <Text style={styles.ruleDesc}>Bán kính 8km quanh sân bay dân dụng/quân sự, cơ quan công sở nhà nước.</Text>
                    </View>
                  </View>
                  <View style={styles.ruleItem}>
                    <View style={[styles.ruleIndicator, { backgroundColor: '#F59E0B' }]} />
                    <View style={styles.ruleContent}>
                      <Text style={styles.ruleName}>Vùng hạn chế bay (Restricted Zone)</Text>
                      <Text style={styles.ruleDesc}>Hồ trung tâm, khu đô thị mật độ cao, độ cao bay tối đa bắt buộc dưới 120m.</Text>
                    </View>
                  </View>
                  <View style={[styles.ruleItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                    <View style={[styles.ruleIndicator, { backgroundColor: '#10B981' }]} />
                    <View style={styles.ruleContent}>
                      <Text style={styles.ruleName}>Vùng được phép thử nghiệm</Text>
                      <Text style={styles.ruleDesc}>Cao độ bay dưới 30m tại các khu công nghiệp mở hoặc vùng ngoại thành được duyệt.</Text>
                    </View>
                  </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
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
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  weatherTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    letterSpacing: 1,
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusDotText: {
    fontSize: 9,
    color: '#065F46',
    fontWeight: 'bold',
  },
  weatherMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
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
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statNumber: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },
  blockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 2,
  },
  viewMoreText: {
    fontSize: 12,
    color: '#0080FF',
    fontWeight: 'bold',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  checkText: {
    color: '#475569',
    fontSize: 13,
    flex: 1,
  },
  checkedText: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
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
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 3,
  },
  emptyRecentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyRecentText: {
    fontSize: 13,
    color: '#64748B',
  },
  recentLogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  recentLogMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentLogModel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  recentLogTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  recentLogRight: {
    alignItems: 'flex-end',
  },
  recentLogValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0080FF',
  },
  recentLogLabel: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
  },
  ruleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 10,
  },
  ruleIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 10,
  },
  ruleContent: {
    flex: 1,
  },
  ruleName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  ruleDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 15,
  },
});

export default UserDashboard;
