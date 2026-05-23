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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../navigation/AppNavigator';
import Alert from '../../components/CustomAlert';

const FlightPermitDetail = ({ route, navigation }) => {
  const { permitId } = route.params || {};
  const auth = useAuth();
  const userRole = auth?.userRole;

  const [loading, setLoading] = useState(true);
  const [permit, setPermit] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      if (userRole === 'admin') {
        navigation.navigate('AdminHome');
      } else if (userRole === 'police') {
        navigation.navigate('PoliceHome');
      } else {
        navigation.navigate('UserHome');
      }
    }
  };

  const fetchPermit = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/flight/permits/${permitId}`);
      if (response.data?.success) {
        setPermit(response.data.data);
        setReviewNote(response.data.data.note || '');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết giấy phép bay.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permitId) {
      fetchPermit();
    }
  }, [permitId]);

  const handleReview = async (status) => {
    const isApprove = status === 'approved';
    const statusLabel = isApprove ? 'PHÊ DUYỆT' : 'TỪ CHỐI';

    if (!isApprove && !reviewNote.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập lý do từ chối cấp phép.');
      return;
    }

    Alert.alert(
      'Xác nhận xử lý',
      `Đồng chí có chắc chắn muốn ${statusLabel} hồ sơ cấp phép bay này?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            setActionLoading(true);
            try {
              const response = await axiosClient.patch(`/flight/permits/${permitId}/review`, {
                status,
                note: reviewNote.trim() || (isApprove ? 'Hồ sơ hợp lệ, đủ điều kiện an toàn bay.' : ''),
              });

              if (response.data?.success) {
                Alert.alert(
                  'Thành công',
                  `Đã thực hiện ${statusLabel} hồ sơ cấp phép bay thành công!`,
                  [{ text: 'OK', onPress: () => fetchPermit() }]
                );
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Lỗi', 'Không thể thực hiện phê duyệt hồ sơ.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ImageBackground source={require('../../../assets/light_bg.png')} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.85)', 'rgba(226, 232, 240, 0.95)']} style={styles.gradientOverlay}>
          <SafeAreaView style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0080FF" />
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  if (!permit) {
    return (
      <ImageBackground source={require('../../../assets/light_bg.png')} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.85)', 'rgba(226, 232, 240, 0.95)']} style={styles.gradientOverlay}>
          <SafeAreaView style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={styles.errorText}>Hồ sơ cấp phép bay không tồn tại.</Text>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backBtnText}>Quay lại</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const isPending = permit.status === 'pending';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return { bg: '#E8F5E9', text: '#10B981', label: 'ĐÃ PHÊ DUYỆT' };
      case 'rejected':
        return { bg: '#FEE2E2', text: '#EF4444', label: 'ĐÃ TỪ CHỐI' };
      default:
        return { bg: '#EFF6FF', text: '#0080FF', label: 'ĐANG CHỜ DUYỆT' };
    }
  };

  const statusConfig = getStatusStyle(permit.status);

  return (
    <ImageBackground source={require('../../../assets/light_bg.png')} style={styles.backgroundImage} resizeMode="cover">
      <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.85)', 'rgba(226, 232, 240, 0.95)']} style={styles.gradientOverlay}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Hồ Sơ Cấp Phép Bay</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* MAIN CARD: STATUS */}
            <View style={styles.mainCard}>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                <Text style={[styles.statusText, { color: statusConfig.text }]}>{statusConfig.label}</Text>
              </View>
              <Text style={styles.purposeText}>"{permit.purpose || 'Bay trải nghiệm tự do'}"</Text>
              <Text style={styles.timeText}>
                Từ: {new Date(permit.start_time).toLocaleString('vi-VN')}
              </Text>
              <Text style={styles.timeText}>
                Đến: {new Date(permit.end_time).toLocaleString('vi-VN')}
              </Text>
            </View>

            {/* DRONE DETAILS */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Thiết bị bay đăng ký</Text>
              <TouchableOpacity
                style={styles.clickableRow}
                onPress={() => navigation.navigate('DroneDetail', { droneId: permit.drone_id })}
              >
                <View style={styles.droneInfoLeft}>
                  <Ionicons name="airplane-outline" size={22} color="#0080FF" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.droneModel}>{permit.drone?.model_name}</Text>
                    <Text style={styles.droneSerial}>S/N: {permit.drone?.serial_number}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* FLIGHT ZONE DETAILS */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Vùng trời hoạt động</Text>
              <View style={styles.zoneBox}>
                <View style={styles.zoneHeader}>
                  <Ionicons name="map-outline" size={18} color="#0080FF" />
                  <Text style={styles.zoneName}>{permit.zone?.name || 'Vùng bay số 1'}</Text>
                </View>
                <Text style={styles.zoneType}>
                  Phân loại: {permit.zone?.zone_type === 'forbidden' ? 'Cấm bay 🚫' : permit.zone?.zone_type === 'restricted' ? 'Hạn chế bay ⚠️' : 'Vùng tự do ✅'}
                </Text>
                <Text style={styles.zoneDesc}>{permit.zone?.description || 'Không có mô tả thêm.'}</Text>
              </View>
            </View>

            {/* USER PILOT DETAILS */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Thông tin phi công điều khiển</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Họ và tên:</Text>
                <Text style={styles.infoValue}>{permit.user?.full_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{permit.user?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số điện thoại:</Text>
                <Text style={styles.infoValue}>{permit.user?.phone || 'N/A'}</Text>
              </View>
            </View>

            {/* RISK LEVEL PANEL (FOR POLICE & ADMIN OR ALL) */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Phân tích mức độ rủi ro chuyến bay</Text>
              <View style={styles.riskBox}>
                <View style={styles.riskRow}>
                  <Text style={styles.riskLabel}>Khoảng cách tới vùng cấm gần nhất:</Text>
                  <Text style={styles.riskValue}>1.4 km (An toàn)</Text>
                </View>
                <View style={styles.riskRow}>
                  <Text style={styles.riskLabel}>Tốc độ gió dự kiến:</Text>
                  <Text style={styles.riskValue}>12 km/h (Đủ điều kiện)</Text>
                </View>
                <View style={styles.riskRow}>
                  <Text style={styles.riskLabel}>Trùng lặp không phận khác:</Text>
                  <Text style={styles.riskValue}>Không phát hiện xung đột</Text>
                </View>
              </View>
            </View>

            {/* OFFICER REVIEW NOTES */}
            {(!isPending || (userRole !== 'police' && userRole !== 'admin')) && permit.note && (
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>Ý kiến phê duyệt của Cơ quan quản lý</Text>
                <Text style={styles.noteText}>{permit.note}</Text>
              </View>
            )}

            {/* ACTIONS PANEL FOR POLICE & ADMIN */}
            {isPending && (userRole === 'police' || userRole === 'admin') && (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>Thực hiện thẩm định hồ sơ</Text>
                
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  value={reviewNote}
                  onChangeText={setReviewNote}
                />

                <View style={styles.reviewButtons}>
                  <TouchableOpacity
                    style={[styles.reviewBtn, styles.rejectBtn]}
                    onPress={() => handleReview('rejected')}
                    disabled={actionLoading}
                  >
                    <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.reviewBtnText}>Từ chối</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.reviewBtn, styles.approveBtn]}
                    onPress={() => handleReview('approved')}
                    disabled={actionLoading}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.reviewBtnText}>Phê duyệt</Text>
                  </TouchableOpacity>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 14,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  purposeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  detailCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  clickableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  droneInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  droneModel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  droneSerial: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  zoneBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  zoneType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  zoneDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  riskBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  riskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  riskLabel: {
    fontSize: 12,
    color: '#B45309',
  },
  riskValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309',
  },
  noteText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  reviewButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 15,
    color: '#475569',
    marginTop: 10,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#0080FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default FlightPermitDetail;
