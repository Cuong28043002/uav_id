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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../navigation/AppNavigator';
import Alert from '../../components/CustomAlert';

const ViolationDetail = ({ route, navigation }) => {
  const { violationId } = route.params || {};
  const auth = useAuth();
  const userRole = auth?.userRole;

  const [loading, setLoading] = useState(true);
  const [violation, setViolation] = useState(null);
  const [paying, setPaying] = useState(false);

  const fetchViolation = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/violations/${violationId}`);
      if (response.data?.success) {
        setViolation(response.data.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết biên bản vi phạm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (violationId) {
      fetchViolation();
    }
  }, [violationId]);

  const handlePay = async () => {
    Alert.alert(
      'Thanh toán điện tử',
      `Bạn đang thực hiện nộp phạt trực tuyến số tiền ${violation?.fine_amount?.toLocaleString('vi-VN')} VNĐ cho vi phạm này.\n\nBạn có chắc chắn muốn xác nhận thanh toán?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận nộp',
          onPress: async () => {
            setPaying(true);
            try {
              const response = await axiosClient.put(`/violations/${violationId}/pay`);
              if (response.data?.success) {
                Alert.alert(
                  'Thành công',
                  'Đã nộp phạt trực tuyến thành công biên lai này!',
                  [{ text: 'OK', onPress: () => fetchViolation() }]
                );
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Lỗi', 'Thanh toán biên lai thất bại.');
            } finally {
              setPaying(false);
            }
          },
        },
      ]
    );
  };

  const handleAdminVerify = async () => {
    Alert.alert(
      'Xác nhận thanh toán',
      'Đồng chí xác nhận đã thu tiền phạt trực tiếp từ chủ sở hữu và chuyển trạng thái biên lai thành ĐÃ THANH TOÁN?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            setPaying(true);
            try {
              const response = await axiosClient.patch(`/violations/${violationId}/status`, { status: 'paid' });
              if (response.data?.success) {
                Alert.alert(
                  'Thành công',
                  'Đã cập nhật trạng thái biên lai thành đã thanh toán!',
                  [{ text: 'OK', onPress: () => fetchViolation() }]
                );
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Lỗi', 'Cập nhật trạng thái thất bại.');
            } finally {
              setPaying(false);
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

  if (!violation) {
    return (
      <ImageBackground source={require('../../../assets/light_bg.png')} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.85)', 'rgba(226, 232, 240, 0.95)']} style={styles.gradientOverlay}>
          <SafeAreaView style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={styles.errorText}>Biên bản vi phạm không tồn tại.</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>Quay lại</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const isUnpaid = violation.status === 'unpaid';

  return (
    <ImageBackground source={require('../../../assets/light_bg.png')} style={styles.backgroundImage} resizeMode="cover">
      <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.85)', 'rgba(226, 232, 240, 0.95)']} style={styles.gradientOverlay}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi Tiết Biên Bản Vi Phạm</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* VIOLATION MAIN BOX */}
            <View style={styles.mainCard}>
              <View style={[styles.statusBadge, isUnpaid ? styles.statusUnpaid : styles.statusPaid]}>
                <Ionicons
                  name={isUnpaid ? 'warning' : 'checkmark-circle'}
                  size={18}
                  color={isUnpaid ? '#EF4444' : '#10B981'}
                />
                <Text style={[styles.statusText, isUnpaid ? styles.statusUnpaidText : styles.statusPaidText]}>
                  {isUnpaid ? 'CHƯA THANH TOÁN' : 'ĐÃ NỘP PHẠT'}
                </Text>
              </View>

              <Text style={styles.violationType}>{violation.violation_type}</Text>
              <Text style={styles.fineAmount}>
                {violation.fine_amount ? `${violation.fine_amount.toLocaleString('vi-VN')} VNĐ` : 'Cảnh cáo'}
              </Text>
              
              <Text style={styles.dateLabel}>
                Ngày lập biên bản: {new Date(violation.date_recorded).toLocaleString('vi-VN')}
              </Text>
            </View>

            {/* DETAIL DATA */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Mô tả sự việc & bằng chứng</Text>
              <Text style={styles.description}>
                {violation.description || 'Không có mô tả chi tiết bằng chứng kèm theo.'}
              </Text>
            </View>

            {/* DRONE DETAILS */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Thiết bị vi phạm</Text>
              <TouchableOpacity
                style={styles.clickableRow}
                onPress={() => navigation.navigate('DroneDetail', { droneId: violation.drone_id })}
              >
                <View style={styles.droneInfoLeft}>
                  <Ionicons name="airplane-outline" size={22} color="#0080FF" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.droneModel}>{violation.drone?.model_name}</Text>
                    <Text style={styles.droneSerial}>S/N: {violation.drone?.serial_number}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* USER DETAILS */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>Đối tượng vi phạm (Chủ sở hữu)</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Họ và tên:</Text>
                <Text style={styles.infoValue}>{violation.user?.full_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email liên hệ:</Text>
                <Text style={styles.infoValue}>{violation.user?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số điện thoại:</Text>
                <Text style={styles.infoValue}>{violation.user?.phone || 'N/A'}</Text>
              </View>
            </View>

            {/* ACTION BUTTON */}
            {isUnpaid && (
              <View style={{ marginTop: 10 }}>
                {userRole === 'user' ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.payBtn]}
                    onPress={handlePay}
                    disabled={paying}
                  >
                    {paying ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="card" size={20} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Nộp phạt trực tuyến qua Cổng DVC</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : userRole === 'admin' ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.payBtn]}
                    onPress={handleAdminVerify}
                    disabled={paying}
                  >
                    {paying ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-done-circle" size={20} color="#FFFFFF" />
                        <Text style={styles.actionBtnText}>Xác nhận đã đóng phạt trực tiếp</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View style={styles.policeInfoBox}>
                    <Ionicons name="information-circle" size={18} color="#64748B" />
                    <Text style={styles.policeInfoText}>
                      Biên lai chưa được thanh toán. Chỉ Admin được quyền duyệt đóng phạt tiền mặt hoặc chủ sở hữu tự đóng trực tuyến.
                    </Text>
                  </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 14,
  },
  statusPaid: {
    backgroundColor: '#E8F5E9',
  },
  statusUnpaid: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusPaidText: {
    color: '#10B981',
  },
  statusUnpaidText: {
    color: '#EF4444',
  },
  violationType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  fineAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#EF4444',
    marginVertical: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#64748B',
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
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
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
  actionBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtn: {
    backgroundColor: '#0080FF',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  policeInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  policeInfoText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    lineHeight: 18,
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

export default ViolationDetail;
