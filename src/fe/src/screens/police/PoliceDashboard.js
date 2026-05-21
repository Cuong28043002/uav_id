import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../navigation/AppNavigator';
import Alert from '../../components/CustomAlert';

const PoliceDashboard = ({ navigation }) => {
  const auth = useAuth();
  const [policeName, setPoliceName] = useState('Sĩ quan');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Shift Patrol States
  const [isPatrolling, setIsPatrolling] = useState(false);
  const [shiftStart, setShiftStart] = useState(null);
  const [patrolSector, setPatrolSector] = useState('Khu vực 1 - Trung tâm');
  const [shiftStats, setShiftStats] = useState({ inspections: 0, violations: 0 });
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [shiftNote, setShiftNote] = useState('');
  const [shiftHistory, setShiftHistory] = useState([]);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  const sectors = [
    'Phân khu 1 - Nội thành & Phố đi bộ',
    'Phân khu 2 - Vành đai Sân bay Quốc tế',
    'Phân khu 3 - Khu Công nghệ cao & Đô thị mới',
    'Phân khu 4 - Vùng ven sông & Biên giới đường thủy',
  ];

  // Timer Effect
  useEffect(() => {
    let interval;
    if (isPatrolling && shiftStart) {
      interval = setInterval(() => {
        const diff = new Date() - new Date(shiftStart);
        const hrs = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
    } else {
      setElapsedTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [isPatrolling, shiftStart]);

  const initData = async () => {
    setLoading(true);
    try {
      // 1. Get user name
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setPoliceName(user.full_name || 'Sĩ quan');
      }

      // 2. Get active shift if exists
      const activeShiftStr = await AsyncStorage.getItem('active_shift');
      if (activeShiftStr) {
        const activeShift = JSON.parse(activeShiftStr);
        setIsPatrolling(true);
        setShiftStart(activeShift.startTime);
        setPatrolSector(activeShift.sector);
        setShiftStats(activeShift.stats || { inspections: 0, violations: 0 });
      }

      // 3. Get shift history
      const shiftHistoryStr = await AsyncStorage.getItem('shift_history');
      if (shiftHistoryStr) {
        setShiftHistory(JSON.parse(shiftHistoryStr));
      }

      // 4. Get lookup history from BE
      const response = await axiosClient.get('/lookup-history?limit=5');
      setHistory(response.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const handleStartShift = async () => {
    const startTime = new Date().toISOString();
    const activeShift = {
      startTime,
      sector: patrolSector,
      stats: { inspections: 0, violations: 0 },
    };

    try {
      await AsyncStorage.setItem('active_shift', JSON.stringify(activeShift));
      setIsPatrolling(true);
      setShiftStart(startTime);
      setShowStartModal(false);
      Alert.alert('Bắt đầu ca trực', `Đã kích hoạt ca tuần tra tại địa bàn: ${patrolSector}`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể bắt đầu ca trực.');
    }
  };

  const handleEndShift = async () => {
    try {
      const endTime = new Date().toISOString();
      const patrolSession = {
        id: Date.now().toString(),
        startTime: shiftStart,
        endTime,
        sector: patrolSector,
        duration: elapsedTime,
        stats: shiftStats,
        notes: shiftNote.trim() || 'Không có ghi chú',
      };

      const updatedHistory = [patrolSession, ...shiftHistory];
      await AsyncStorage.setItem('shift_history', JSON.stringify(updatedHistory));
      await AsyncStorage.removeItem('active_shift');

      setShiftHistory(updatedHistory);
      setIsPatrolling(false);
      setShiftStart(null);
      setShiftNote('');
      setShowEndModal(false);

      Alert.alert('Kết thúc ca trực', 'Đã lưu biên bản kết thúc ca tuần tra và báo cáo tổng kết.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết thúc ca trực.');
    }
  };

  const handleLogout = async () => {
    if (isPatrolling) {
      Alert.alert('Cảnh báo', 'Bạn đang trong ca trực tuần tra. Vui lòng kết thúc ca trực trước khi đăng xuất.');
      return;
    }

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

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('SearchDrones', { identification_code: item.identification_code })}
    >
      <View style={styles.historyInfo}>
        <Text style={styles.historyCode}>{item.identification_code}</Text>
        <Text style={styles.historyTime}>
          {new Date(item.createdAt).toLocaleString('vi-VN')}
        </Text>
      </View>
      <View style={styles.ipBadge}>
        <Text style={styles.ipText}>{item.ip_address || 'Đặc vụ'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderShiftLogItem = ({ item }) => {
    const dateStr = new Date(item.startTime).toLocaleDateString('vi-VN');

    return (
      <View style={styles.logCard}>
        <View style={styles.logHeader}>
          <Text style={styles.logDate}>{dateStr}</Text>
          <Text style={styles.logDuration}>Thời lượng: {item.duration}</Text>
        </View>
        <Text style={styles.logSector}>{item.sector}</Text>
        <View style={styles.logStats}>
          <Text style={styles.logStatText}>Kiểm tra: {item.stats?.inspections || 0} lượt</Text>
          <Text style={styles.logStatText}>Phát hiện vi phạm: {item.stats?.violations || 0} ca</Text>
        </View>
        <Text style={styles.logNotes}>Báo cáo: {item.notes}</Text>
      </View>
    );
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
              <Text style={styles.headerSubtitle}>LỰC LƯỢNG TUẦN TRA KHÔNG LƯU</Text>
              <Text style={styles.headerTitle}>Chào, {policeName}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#0080FF" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* DECORATIVE Tech Blobs */}
            <View style={styles.techBlob1} />
            <View style={styles.techBlob2} />

            {/* BANNER CA TRỰC */}
            <View style={styles.patrolCard}>
              <View style={styles.patrolHeader}>
                <Text style={styles.patrolTitle}>HỆ THỐNG CA TRỰC AN NINH</Text>
                <View style={[styles.badgeActive, isPatrolling ? styles.badgeActivePatrol : styles.badgeInactivePatrol]}>
                  <Text style={[styles.badgeActiveText, isPatrolling ? styles.badgeActivePatrolText : styles.badgeInactivePatrolText]}>
                    {isPatrolling ? 'ĐANG TUẦN TRA' : 'NGOÀI CA TRỰC'}
                  </Text>
                </View>
              </View>

              {isPatrolling ? (
                <View style={styles.activeShiftContainer}>
                  <Text style={styles.activeSector}>{patrolSector}</Text>
                  <View style={styles.timerContainer}>
                    <Ionicons name="time-outline" size={22} color="#0080FF" />
                    <Text style={styles.timerText}>{elapsedTime}</Text>
                  </View>

                  <View style={styles.patrolGrid}>
                    <View style={styles.patrolItem}>
                      <Ionicons name="eye-outline" size={22} color="#0080FF" />
                      <Text style={styles.patrolVal}>{shiftStats.inspections} lượt</Text>
                      <Text style={styles.patrolLabel}>Đã kiểm định</Text>
                    </View>
                    <View style={styles.patrolItem}>
                      <Ionicons name="warning-outline" size={22} color="#0080FF" />
                      <Text style={styles.patrolVal}>{shiftStats.violations} ca</Text>
                      <Text style={styles.patrolLabel}>Lập biên bản</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.patrolBtn, styles.endShiftBtn]}
                    onPress={() => setShowEndModal(true)}
                  >
                    <Text style={styles.endShiftBtnText}>Kết thúc ca trực & Nộp báo cáo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.inactiveShiftContainer}>
                  <Text style={styles.inactiveDesc}>
                    Chào đồng chí, vui lòng kích hoạt ca trực mới để bắt đầu thực hiện kiểm soát không phận, kiểm tra đăng ký và lập biên bản các trường hợp UAV vi phạm.
                  </Text>
                  <TouchableOpacity
                    style={[styles.patrolBtn, styles.startShiftBtn]}
                    onPress={() => setShowStartModal(true)}
                  >
                    <Text style={styles.patrolBtnText}>Bắt đầu ca trực tuần tra</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* KHỐI TRẠNG THÁI RA-ĐA VÀ VỆ TINH TUẦN TRA (NEW & INFORMATION RICH) */}
            <Text style={styles.sectionTitle}>Trạng thái cảm biến vệ tinh & Radar</Text>
            <View style={styles.radarCard}>
              <View style={styles.radarRow}>
                <View style={styles.radarDetail}>
                  <Ionicons name="wifi-outline" size={18} color="#0080FF" />
                  <Text style={styles.radarVal}>98% - Tốt</Text>
                  <Text style={styles.radarLabel}>Sóng Vô Tuyến</Text>
                </View>
                <View style={styles.radarDetail}>
                  <Ionicons name="compass-outline" size={18} color="#0080FF" />
                  <Text style={styles.radarVal}>21 Vệ tinh</Text>
                  <Text style={styles.radarLabel}>GPS / GLONASS</Text>
                </View>
                <View style={styles.radarDetail}>
                  <Ionicons name="pulse" size={18} color="#0080FF" />
                  <Text style={styles.radarVal}>500 MHz</Text>
                  <Text style={styles.radarLabel}>Tần Số Quét</Text>
                </View>
              </View>
              <View style={styles.radarFooter}>
                <Text style={styles.radarFooterText}>
                  ● Trạm kiểm soát không lưu khu vực: KẾT NỐI ỔN ĐỊNH
                </Text>
              </View>
            </View>

            {/* PHÍM CHỨC NĂNG NHIỆM VỤ */}
            <Text style={styles.sectionTitle}>Các chức năng tuần tra nghiệp vụ</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={[styles.actionCard, { borderColor: '#E2E8F0' }]}
                onPress={() => navigation.navigate('SearchDrones')}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons name="search" size={24} color="#0080FF" />
                </View>
                <Text style={styles.actionCardTitle}>Tra cứu UAV</Text>
                <Text style={styles.actionCardDesc}>Nhập mã S/N để tra cứu đăng ký chủ sở hữu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { borderColor: '#E2E8F0' }]}
                onPress={() => navigation.navigate('ApproveDrones')}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons name="checkmark-circle" size={24} color="#0080FF" />
                </View>
                <Text style={styles.actionCardTitle}>Duyệt đăng ký UAV</Text>
                <Text style={styles.actionCardDesc}>Phê duyệt hồ sơ đăng ký và cấp mã định danh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { borderColor: '#E2E8F0' }]}
                onPress={() => navigation.navigate('InspectionScreen')}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons name="shield-checkmark" size={24} color="#0080FF" />
                </View>
                <Text style={styles.actionCardTitle}>Kiểm định UAV</Text>
                <Text style={styles.actionCardDesc}>Lập biên bản kiểm tra thông số kỹ thuật thực địa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { borderColor: '#E2E8F0' }]}
                onPress={() => navigation.navigate('ReportViolation')}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons name="warning" size={24} color="#0080FF" />
                </View>
                <Text style={styles.actionCardTitle}>Lập BB vi phạm</Text>
                <Text style={styles.actionCardDesc}>Ghi nhận UAV bay không phép hoặc vào vùng cấm</Text>
              </TouchableOpacity>
            </View>

            {/* QUY TRÌNH NGHIỆP VỤ CHO SĨ QUAN */}
            <Text style={styles.sectionTitle}>Quy trình nghiệp vụ xử lý thực địa</Text>
            <View style={styles.ruleCard}>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNum}>01</Text>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleName}>Yêu cầu kiểm tra mã QR định danh UAV</Text>
                  <Text style={styles.ruleDesc}>
                    Yêu cầu chủ sở hữu xuất trình mã QR định danh được dán trên thân máy bay. Sử dụng Tab quét QR để kiểm tra tính hợp lệ.
                  </Text>
                </View>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleNum}>02</Text>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleName}>Đối chiếu bản đồ không phận và giấy phép bay</Text>
                  <Text style={styles.ruleDesc}>
                    Xác nhận tọa độ thiết bị bay có nằm trong vùng bay tự do hoặc có giấy phép bay hợp lệ được cấp bởi cơ quan chức năng hay không.
                  </Text>
                </View>
              </View>
              <View style={[styles.ruleItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <Text style={styles.ruleNum}>03</Text>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleName}>Lập biên bản vi phạm hành chính</Text>
                  <Text style={styles.ruleDesc}>
                    Trường hợp cố tình hoạt động không phép hoặc vi phạm vùng cấm, tiến hành đình chỉ bay lập tức, lập biên bản ghi hình và áp phí phạt.
                  </Text>
                </View>
              </View>
            </View>

            {/* LỊCH SỬ TUẦN TRA CA TRỰC CỦA TÔI */}
            <Text style={styles.sectionTitle}>Lịch sử ca trực tuần tra gần đây</Text>
            {shiftHistory.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chưa ghi nhận ca trực tuần tra nào</Text>
              </View>
            ) : (
              <FlatList
                data={shiftHistory.slice(0, 3)}
                keyExtractor={(item) => item.id}
                renderItem={renderShiftLogItem}
                scrollEnabled={false}
              />
            )}

            {/* LỊCH SỬ TRA CỨU GẦN ĐÂY */}
            <Text style={styles.sectionTitle}>Lịch sử tra cứu CSDL gần đây</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHistoryItem}
                scrollEnabled={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Chưa có lịch sử tra cứu trên hệ thống</Text>
                  </View>
                }
              />
            )}
          </ScrollView>

          {/* MODAL START SHIFT */}
          <Modal visible={showStartModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Bắt đầu ca tuần tra mới</Text>
                <Text style={styles.modalDesc}>Vui lòng xác nhận địa bàn tuần tra của đồng chí:</Text>

                {sectors.map((sector) => (
                  <TouchableOpacity
                    key={sector}
                    style={[styles.sectorItem, patrolSector === sector && styles.activeSectorItem]}
                    onPress={() => setPatrolSector(sector)}
                  >
                    <Text style={[styles.sectorText, patrolSector === sector && styles.activeSectorText]}>
                      {sector}
                    </Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalSubmitBtn]}
                    onPress={handleStartShift}
                  >
                    <Text style={styles.modalBtnText}>Xác nhận bắt đầu ca trực</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalCancelBtn]}
                    onPress={() => setShowStartModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Hủy bỏ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* MODAL END SHIFT */}
          <Modal visible={showEndModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Báo cáo kết thúc ca trực</Text>
                <Text style={styles.modalDesc}>
                  Vui lòng nhập tóm tắt biên bản kết quả tuần tra tại thực địa:
                </Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Nhập nội dung báo cáo tại đây..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  value={shiftNote}
                  onChangeText={setShiftNote}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalSubmitBtn]}
                    onPress={handleEndShift}
                  >
                    <Text style={styles.modalBtnText}>Nộp báo cáo tuần tra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalCancelBtn]}
                    onPress={() => setShowEndModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Quay lại</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    paddingHorizontal: 16,
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
  patrolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  patrolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  patrolTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    letterSpacing: 1,
  },
  badgeActive: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeActivePatrol: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  badgeActivePatrolText: {
    color: '#065F46',
    fontWeight: 'bold',
    fontSize: 10,
  },
  badgeInactivePatrol: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  badgeInactivePatrolText: {
    color: '#64748B',
    fontWeight: 'bold',
    fontSize: 10,
  },
  activeShiftContainer: {
    marginTop: 12,
  },
  activeSector: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0080FF',
    fontFamily: 'monospace',
  },
  patrolGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  patrolItem: {
    alignItems: 'center',
  },
  patrolVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 4,
  },
  patrolLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  patrolBtn: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endShiftBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  endShiftBtnText: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  inactiveShiftContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  inactiveDesc: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  startShiftBtn: {
    backgroundColor: '#0080FF',
    width: '100%',
  },
  patrolBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  radarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radarDetail: {
    alignItems: 'center',
    flex: 1,
  },
  radarVal: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },
  radarLabel: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 2,
  },
  radarFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 12,
    paddingTop: 8,
    alignItems: 'center',
  },
  radarFooterText: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
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
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  actionCardTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },
  actionCardDesc: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  disabledText: {
    color: '#94A3B8',
  },
  violationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  historyInfo: {
    flex: 1,
  },
  historyCode: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyTime: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  ipBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ipText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logDate: {
    fontWeight: 'bold',
    color: '#0F172A',
    fontSize: 13,
  },
  logDuration: {
    fontSize: 12,
    color: '#64748B',
  },
  logSector: {
    color: '#0080FF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  logStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  logStatText: {
    fontSize: 12,
    color: '#475569',
  },
  logNotes: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  sectorItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  activeSectorItem: {
    borderColor: '#0080FF',
    backgroundColor: '#EFF6FF',
  },
  sectorText: {
    fontSize: 13,
    color: '#475569',
  },
  activeSectorText: {
    color: '#0080FF',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubmitBtn: {
    backgroundColor: '#0080FF',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalCancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    color: '#0F172A',
    fontSize: 13,
    marginBottom: 16,
    height: 80,
  },
  ruleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 12,
    gap: 12,
  },
  ruleNum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0080FF',
    width: 24,
    textAlign: 'center',
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

export default PoliceDashboard;
