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
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

const DroneDetail = ({ route, navigation }) => {
  const { droneId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [drone, setDrone] = useState(null);
  const [flightLogs, setFlightLogs] = useState([]);
  const [violations, setViolations] = useState([]);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'logs' | 'violations'

  const renderSignature = (registration) => {
    if (!registration || !registration.signature) return null;
    const sigStr = registration.signature;
    
    if (sigStr.startsWith('cursive:')) {
      const parts = sigStr.split(':');
      const styleIdx = parseInt(parts[1]) || 0;
      const name = parts[2] || 'Sĩ quan tuần tra';
      
      let textStyle = { fontFamily: 'serif', fontStyle: 'italic', fontWeight: 'bold' };
      if (styleIdx === 1) {
        textStyle = { fontStyle: 'italic', textDecorationLine: 'underline', letterSpacing: 2 };
      } else if (styleIdx === 2) {
        textStyle = { fontFamily: 'monospace', fontWeight: 'bold', fontStyle: 'italic' };
      }
      
      return (
        <View style={styles.signatureCard}>
          <Text style={[styles.signatureCursiveText, textStyle]}>{name}</Text>
          <Text style={styles.signatureOfficerLabel}>Chữ ký điện tử Sĩ quan phê duyệt</Text>
        </View>
      );
    }
    
    try {
      const sigPoints = JSON.parse(sigStr);
      if (Array.isArray(sigPoints) && sigPoints.length > 0) {
        return (
          <View style={styles.signatureCard}>
            <View style={styles.miniCanvas}>
              {sigPoints.map((p, idx) => (
                <View
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: (p.x / 3),
                    top: (p.y / 3),
                    width: 2,
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: '#0F172A',
                  }}
                />
              ))}
            </View>
            <Text style={styles.signatureOfficerLabel}>Chữ ký tay xác thực hệ thống</Text>
          </View>
        );
      }
    } catch (e) {
      // fallback
    }
    return null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get Drone Details
      const droneRes = await axiosClient.get(`/drones/${droneId}`);
      if (droneRes.data?.success) {
        setDrone(droneRes.data.data);
      }

      // 2. Get Flight Logs for this drone
      const logsRes = await axiosClient.get(`/flight/logs?drone_id=${droneId}&limit=5`);
      setFlightLogs(logsRes.data?.data || []);

      // 3. Get Violations for this drone
      const violationsRes = await axiosClient.get(`/violations?drone_id=${droneId}`);
      setViolations(violationsRes.data?.data || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải thông tin chi tiết UAV.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (droneId) {
      fetchData();
    }
  }, [droneId]);

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

  if (!drone) {
    return (
      <ImageBackground source={require('../../../assets/light_bg.png')} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.85)', 'rgba(226, 232, 240, 0.95)']} style={styles.gradientOverlay}>
          <SafeAreaView style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={styles.errorText}>Không tìm thấy dữ liệu máy bay.</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>Quay lại</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const renderFlightLog = ({ item }) => (
    <View style={styles.logCard}>
      <View style={styles.logHeader}>
        <Text style={styles.logDate}>{new Date(item.startTime || item.start_time).toLocaleDateString('vi-VN')}</Text>
        <Text style={styles.logTime}>
          {new Date(item.startTime || item.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.logGrid}>
        <View style={styles.logGridItem}>
          <Text style={styles.logGridLabel}>Độ cao tối đa</Text>
          <Text style={styles.logGridVal}>{item.max_altitude || item.maxAltitude} m</Text>
        </View>
        <View style={styles.logGridItem}>
          <Text style={styles.logGridLabel}>Quãng đường</Text>
          <Text style={styles.logGridVal}>{item.distance} m</Text>
        </View>
      </View>
    </View>
  );

  const renderViolation = ({ item }) => (
    <TouchableOpacity
      style={styles.violationCard}
      onPress={() => navigation.navigate('ViolationDetail', { violationId: item.id })}
    >
      <View style={styles.violationHeader}>
        <View style={styles.violationTitleBox}>
          <Ionicons name="warning" size={18} color={item.status === 'unpaid' ? '#EF4444' : '#10B981'} />
          <Text style={styles.violationType}>{item.violation_type}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'paid' ? styles.statusPaid : styles.statusUnpaid]}>
          <Text style={[styles.statusText, item.status === 'paid' ? styles.statusPaidText : styles.statusUnpaidText]}>
            {item.status === 'paid' ? 'Đã nộp phạt' : 'Chưa nộp'}
          </Text>
        </View>
      </View>
      <Text style={styles.violationDate}>
        Ngày ghi nhận: {new Date(item.date_recorded).toLocaleDateString('vi-VN')}
      </Text>
      <Text style={styles.violationFine}>
        Mức phạt: {item.fine_amount ? `${item.fine_amount.toLocaleString('vi-VN')} VNĐ` : 'Cảnh cáo'}
      </Text>
    </TouchableOpacity>
  );

  let parsedImages = [];
  if (drone && drone.images) {
    if (Array.isArray(drone.images)) {
      parsedImages = drone.images;
    } else if (typeof drone.images === 'string') {
      try {
        parsedImages = JSON.parse(drone.images);
      } catch (e) {
        const cleaned = drone.images.replace(/[\[\]"]/g, '').trim();
        if (cleaned) {
          parsedImages = cleaned.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }
  }

  return (
    <ImageBackground source={require('../../../assets/light_bg.png')} style={styles.backgroundImage} resizeMode="cover">
      <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(248, 250, 252, 0.85)', 'rgba(226, 232, 240, 0.95)']} style={styles.gradientOverlay}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi Tiết Thiết Bị UAV</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* DRONE GENERAL CARD */}
            <View style={styles.droneMainCard}>
              <View style={styles.droneIconContainer}>
                <Ionicons name="airplane" size={32} color="#0080FF" />
              </View>
              <Text style={styles.modelName}>{drone.model_name}</Text>
              <Text style={styles.serialNumber}>S/N: {drone.serial_number}</Text>
              
              {drone.registrations && drone.registrations.length > 0 && (
                <View style={styles.idCodeContainer}>
                  <Text style={styles.idCodeLabel}>MÃ SỐ ĐỊNH DANH QUỐC GIA</Text>
                  <Text style={styles.idCode}>{drone.registrations[0].identification_code}</Text>
                </View>
              )}
            </View>

            {/* TABS */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'info' && styles.activeTabButton]}
                onPress={() => setActiveTab('info')}
              >
                <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>Thông tin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'logs' && styles.activeTabButton]}
                onPress={() => setActiveTab('logs')}
              >
                <Text style={[styles.tabText, activeTab === 'logs' && styles.activeTabText]}>
                  Nhật ký bay ({flightLogs.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'violations' && styles.activeTabButton]}
                onPress={() => setActiveTab('violations')}
              >
                <Text style={[styles.tabText, activeTab === 'violations' && styles.activeTabText]}>
                  Vi phạm ({violations.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* TAB CONTENT */}
            {activeTab === 'info' && (
              <View style={styles.tabContent}>
                {/* CERTIFICATE / REGISTRATION CARD */}
                {drone.registrations && drone.registrations.length > 0 && drone.registrations[0].status === 'approved' && (
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Chứng nhận Đăng ký Định danh UAV</Text>
                    <Text style={styles.infoSubtitle}>CẤP BỞI BỘ CÔNG AN - CỤC HÀNG KHÔNG VIỆT NAM</Text>
                    
                    <View style={styles.plateContainer}>
                      <LinearGradient colors={['#004B87', '#003366']} style={styles.plateBody}>
                        <View style={styles.plateBorder}>
                          <Text style={styles.plateHeaderText}>UAV ID NATIONAL REGISTRATION</Text>
                          <Text style={styles.plateNumber}>{drone.registrations[0].identification_code}</Text>
                          <Text style={styles.plateFooterText}>BẢO ĐẢM AN NINH HÀNG KHÔNG QUỐC GIA</Text>
                        </View>
                      </LinearGradient>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Ngày cấp biển:</Text>
                      <Text style={styles.infoValue}>
                        {new Date(drone.registrations[0].issue_date || drone.registrations[0].updatedAt).toLocaleDateString('vi-VN')}
                      </Text>
                    </View>

                    {renderSignature(drone.registrations[0])}
                  </View>
                )}

                {/* TECHNICAL SPECS */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Thông số kỹ thuật</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phân loại UAV:</Text>
                    <Text style={styles.infoValue}>{drone.category?.name || 'Chưa phân loại'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Trọng lượng:</Text>
                    <Text style={styles.infoValue}>{drone.weight} kg</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Trần bay tối đa:</Text>
                    <Text style={styles.infoValue}>{drone.max_flight_height || 120} m</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nhà sản xuất:</Text>
                    <Text style={styles.infoValue}>
                      {drone.manufacturer ? `${drone.manufacturer.name} (${drone.manufacturer.country})` : 'N/A'}
                    </Text>
                  </View>
                </View>

                {/* OWNER DETAILS */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Thông tin chủ sở hữu</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Họ và tên:</Text>
                    <Text style={styles.infoValue}>{drone.owner?.full_name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{drone.owner?.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Số điện thoại:</Text>
                    <Text style={styles.infoValue}>{drone.owner?.phone || 'Chưa cập nhật'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Địa chỉ:</Text>
                    <Text style={styles.infoValue}>{drone.owner?.address || 'Chưa cập nhật'}</Text>
                  </View>
                </View>

                {/* IMAGES GALLERY CARD */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Thư viện hình ảnh thiết bị</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                     {parsedImages && parsedImages.length > 0 ? (
                      parsedImages.map((img, idx) => (
                        <View key={idx} style={styles.galleryCard}>
                          <Image source={{ uri: img }} style={styles.galleryImg} />
                        </View>
                      ))
                    ) : (
                      <>
                        <View style={styles.galleryCard}>
                          <View style={[styles.galleryPlaceholder, { backgroundColor: '#EFF6FF' }]}>
                            <Ionicons name="airplane" size={28} color="#0080FF" />
                          </View>
                          <Text style={styles.galleryText}>Góc nghiêng 45°</Text>
                        </View>
                        <View style={styles.galleryCard}>
                          <View style={[styles.galleryPlaceholder, { backgroundColor: '#F0FDF4' }]}>
                            <Ionicons name="barcode-outline" size={28} color="#10B981" />
                          </View>
                          <Text style={styles.galleryText}>Tem nhãn S/N</Text>
                        </View>
                        <View style={styles.galleryCard}>
                          <View style={[styles.galleryPlaceholder, { backgroundColor: '#FFF7ED' }]}>
                            <Ionicons name="card-outline" size={28} color="#F97316" />
                          </View>
                          <Text style={styles.galleryText}>Đơn đề nghị cấp</Text>
                        </View>
                      </>
                    )}
                  </ScrollView>
                </View>
              </View>
            )}

            {activeTab === 'logs' && (
              <View style={styles.tabContent}>
                {flightLogs.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="airplane-outline" size={40} color="#94A3B8" />
                    <Text style={styles.emptyText}>Chưa ghi nhận lịch sử bay nào cho UAV này.</Text>
                  </View>
                ) : (
                  <FlatList
                    data={flightLogs}
                    keyExtractor={(item, idx) => idx.toString()}
                    renderItem={renderFlightLog}
                    scrollEnabled={false}
                  />
                )}
              </View>
            )}

            {activeTab === 'violations' && (
              <View style={styles.tabContent}>
                {violations.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="shield-outline" size={40} color="#94A3B8" />
                    <Text style={styles.emptyText}>Tuyệt vời! Không có biên bản vi phạm nào.</Text>
                  </View>
                ) : (
                  <FlatList
                    data={violations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderViolation}
                    scrollEnabled={false}
                  />
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
  droneMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  droneIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  serialNumber: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  idCodeContainer: {
    marginTop: 16,
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  idCodeLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0080FF',
    letterSpacing: 1,
  },
  idCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0080FF',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#0080FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logDate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  logTime: {
    fontSize: 12,
    color: '#64748B',
  },
  logGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logGridItem: {
    flex: 1,
  },
  logGridLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  logGridVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  violationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  violationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  violationTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 10,
  },
  violationType: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPaid: {
    backgroundColor: '#E8F5E9',
  },
  statusUnpaid: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusPaidText: {
    color: '#10B981',
  },
  statusUnpaidText: {
    color: '#EF4444',
  },
  violationDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  violationFine: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
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
  infoSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  plateContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  plateBody: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    padding: 3,
  },
  plateBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  plateHeaderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  plateNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  plateFooterText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 7,
    fontWeight: 'bold',
  },
  signatureCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  signatureCursiveText: {
    fontSize: 18,
    color: '#0F172A',
    marginVertical: 8,
  },
  signatureOfficerLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: 'bold',
    marginTop: 4,
  },
  miniCanvas: {
    width: 120,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  imageScroll: {
    marginTop: 10,
    flexDirection: 'row',
  },
  galleryCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  galleryImg: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  galleryPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  galleryText: {
    marginTop: 4,
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default DroneDetail;
