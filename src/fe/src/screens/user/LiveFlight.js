import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

const LiveFlight = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [drones, setDrones] = useState([]);
  const [permits, setPermits] = useState([]);

  // Selections
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [selectedPermit, setSelectedPermit] = useState(null);

  // Flight State
  const [isFlying, setIsFlying] = useState(false);
  const [flightTime, setFlightTime] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [lat, setLat] = useState(21.0285);
  const [lng, setLng] = useState(105.8542);
  const [satellites, setSatellites] = useState(14);
  const [speed, setSpeed] = useState(0);
  const [windSpeed, setWindSpeed] = useState(2.8);

  const [savingLog, setSavingLog] = useState(false);

  // Timers
  const timerRef = useRef(null);
  const simRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dronesRes, permitsRes] = await Promise.all([
        axiosClient.get('/drones'),
        axiosClient.get('/flight/permits?status=approved'),
      ]);
      const activeDrones = dronesRes.data?.data || [];
      const approvedPermits = permitsRes.data?.data || [];

      setDrones(activeDrones);
      setPermits(approvedPermits);

      if (activeDrones.length > 0) {
        setSelectedDrone(activeDrones[0]);
      }
      if (approvedPermits.length > 0) {
        setSelectedPermit(approvedPermits[0]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải cấu hình bay.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      stopFlightSimulation();
    };
  }, []);

  const startFlightSimulation = () => {
    if (!selectedDrone) {
      Alert.alert('Thông báo', 'Vui lòng đăng ký/chọn thiết bị UAV trước khi bay.');
      return;
    }

    setIsFlying(true);
    setFlightTime(0);
    setAltitude(0);
    setDistance(0.0);
    setSpeed(12);

    // Initial positioning around Hanoi
    const baseLat = 21.0285 + (Math.random() - 0.5) * 0.01;
    const baseLng = 105.8542 + (Math.random() - 0.5) * 0.01;
    setLat(baseLat);
    setLng(baseLng);

    // Time ticker
    timerRef.current = setInterval(() => {
      setFlightTime((prev) => prev + 1);
    }, 1000);

    // Telemetry simulator
    simRef.current = setInterval(() => {
      // Climb altitude up to ~110m slowly, then oscillate
      setAltitude((prev) => {
        if (prev < 100) return prev + Math.floor(Math.random() * 8) + 4;
        return prev + Math.floor(Math.random() * 5) - 2;
      });

      // Change GPS coordinates slightly
      setLat((prev) => prev + (Math.random() - 0.5) * 0.0001);
      setLng((prev) => prev + (Math.random() - 0.5) * 0.0001);

      // Increase distance
      setDistance((prev) => +(prev + 0.012).toFixed(3));

      // Oscillate speed & wind speed & satellite connection count
      setSpeed((prev) => Math.max(8, Math.min(45, prev + Math.floor(Math.random() * 5) - 2)));
      setWindSpeed((prev) => +(Math.max(1.5, Math.min(8.0, prev + (Math.random() - 0.5) * 0.4)).toFixed(1)));
      setSatellites((prev) => Math.max(10, Math.min(19, prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0))));
    }, 2000);
  };

  const stopFlightSimulation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (simRef.current) {
      clearInterval(simRef.current);
      simRef.current = null;
    }
  };

  const handleLandAndSave = async () => {
    stopFlightSimulation();
    setSavingLog(true);

    try {
      const startTime = new Date(Date.now() - flightTime * 1000).toISOString();
      const endTime = new Date().toISOString();

      const payload = {
        drone_id: selectedDrone.id,
        permit_id: selectedPermit ? selectedPermit.id : null,
        start_time: startTime,
        end_time: endTime,
        max_altitude: altitude,
        distance: distance,
      };

      const response = await axiosClient.post('/flight/logs', payload);
      if (response.data?.success) {
        Alert.alert(
          'Hành trình đã lưu',
          `Hạ cánh an toàn. Đã đồng bộ nhật ký bay thành công!\n\n• Độ cao cực đại: ${altitude} m\n• Quãng đường: ${distance} km\n• Thời gian: ${formatTime(flightTime)}`,
          [{ text: 'Xem lịch sử bay', onPress: () => navigation.navigate('FlightLogs') }]
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Đồng bộ thất bại', 'Hệ thống ngoại tuyến. Hành trình chưa thể lưu.');
    } finally {
      setIsFlying(false);
      setSavingLog(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0080FF" />
      </View>
    );
  }

  const isAltWarning = altitude > 120;

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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Giám Sát Chuyến Bay Thực Địa</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {!isFlying ? (
              <View>
                {/* CONFIG CARD */}
                <View style={styles.configCard}>
                  <Text style={styles.cardTitle}>CẤU HÌNH THIẾT BỊ VÀ PHÉP BAY</Text>
                  <View style={styles.divider} />

                  <Text style={styles.inputLabel}>Chọn UAV thực hiện cất cánh:</Text>
                  <View style={styles.selectorGrid}>
                    {drones.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.selectorItem,
                          selectedDrone?.id === item.id && styles.selectorItemActive,
                        ]}
                        onPress={() => setSelectedDrone(item)}
                      >
                        <MaterialCommunityIcons
                          name="drone"
                          size={18}
                          color={selectedDrone?.id === item.id ? '#FFFFFF' : '#0080FF'}
                        />
                        <Text
                          style={[
                            styles.selectorItemText,
                            selectedDrone?.id === item.id && styles.selectorItemTextActive,
                          ]}
                        >
                          {item.model_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.inputLabel}>Chọn Giấy Phép Bay Hợp Lệ:</Text>
                  {permits.length === 0 ? (
                    <View style={styles.noPermitCard}>
                      <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
                      <Text style={styles.noPermitText}>
                        Bạn không có giấy phép bay nào được duyệt hôm nay. Hãy bay ở độ cao thử nghiệm dưới 30m hoặc đăng ký xin phép.
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.selectorGrid}>
                      {permits.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.selectorItem,
                            selectedPermit?.id === item.id && styles.selectorItemActive,
                          ]}
                          onPress={() => setSelectedPermit(item)}
                        >
                          <Ionicons
                            name="document-text"
                            size={16}
                            color={selectedPermit?.id === item.id ? '#FFFFFF' : '#0080FF'}
                          />
                          <Text
                            style={[
                              styles.selectorItemText,
                              selectedPermit?.id === item.id && styles.selectorItemTextActive,
                            ]}
                          >
                            GP-{item.id} ({item.zone?.name || 'Vùng bay'})
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* SAFETY BRIEFING */}
                <View style={styles.warningCard}>
                  <View style={styles.warningHeader}>
                    <Ionicons name="shield-alert-sharp" size={22} color="#F59E0B" />
                    <Text style={styles.warningTitle}>QUY TẮC AN TOÀN HÀNH LANG KHÔNG PHẬN</Text>
                  </View>
                  <Text style={styles.warningDesc}>
                    Hệ thống sẽ ghi lại hành trình tọa độ định danh của thiết bị tự động. Nếu đi vào khu vực cấm bay hoặc bay quá độ cao quy định, bạn có thể bị phạt hành chính trực tiếp bởi Sĩ quan An ninh hàng không.
                  </Text>
                </View>

                <TouchableOpacity style={styles.startBtn} onPress={startFlightSimulation}>
                  <Ionicons name="play-sharp" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.startBtnText}>KÍCH HOẠT CHUYẾN BAY</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* HUD PANEL */}
                <View style={styles.hudCard}>
                  <View style={styles.hudHeader}>
                    <View style={styles.liveTag}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>HÀNH TRÌNH ĐANG PHÁT SÓNG</Text>
                    </View>
                    <Text style={styles.timerText}>{formatTime(flightTime)}</Text>
                  </View>

                  <View style={styles.hudMainGrid}>
                    <View style={styles.hudCell}>
                      <Text style={styles.hudLabel}>ĐỘ CAO HIỆN TẠI</Text>
                      <Text style={[styles.hudValue, isAltWarning && styles.hudValueAlert]}>
                        {altitude} <Text style={styles.hudUnit}>m</Text>
                      </Text>
                      <Text style={styles.hudSub}>Hạn trần: 120m</Text>
                    </View>

                    <View style={styles.hudCell}>
                      <Text style={styles.hudLabel}>HÀNH TRÌNH ĐÃ BAY</Text>
                      <Text style={styles.hudValue}>
                        {distance.toFixed(3)} <Text style={styles.hudUnit}>km</Text>
                      </Text>
                      <Text style={styles.hudSub}>Tốc độ: {speed} km/h</Text>
                    </View>
                  </View>

                  {isAltWarning && (
                    <View style={styles.hudAlertBox}>
                      <Ionicons name="warning" size={18} color="#EF4444" />
                      <Text style={styles.hudAlertText}>
                        CẢNH BÁO: ĐÃ VƯỢT QUÁ TRẦN BAY THỦ ĐÔ 120M!
                      </Text>
                    </View>
                  )}
                </View>

                {/* COORDINATES & TELEMETRY */}
                <View style={styles.telemetryCard}>
                  <Text style={styles.telTitle}>MÔ PHỎNG THÔNG SỐ KHÔNG PHẬN KẾT NỐI</Text>
                  <View style={styles.divider} />

                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Thiết bị bay:</Text>
                    <Text style={styles.telValue}>{selectedDrone?.model_name}</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Mã định danh định vị:</Text>
                    <Text style={styles.telValue}>{selectedDrone?.serial_number}</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Tọa độ GPS Vĩ độ:</Text>
                    <Text style={styles.telValue}>{lat.toFixed(6)}</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Tọa độ GPS Kinh độ:</Text>
                    <Text style={styles.telValue}>{lng.toFixed(6)}</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Số kết nối vệ tinh GNSS:</Text>
                    <Text style={[styles.telValue, { color: '#10B981' }]}>{satellites} SAT (Tốt)</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Sức gió tại độ cao:</Text>
                    <Text style={styles.telValue}>{windSpeed} m/s (Bình thường)</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Trạng thái luồng truyền:</Text>
                    <Text style={[styles.telValue, { color: '#0080FF' }]}>MÃ HÓA 256-BIT SSL</Text>
                  </View>
                </View>

                {/* LANDING ACTION BUTTON */}
                <TouchableOpacity
                  style={[styles.landBtn, savingLog && styles.disabledBtn]}
                  onPress={handleLandAndSave}
                  disabled={savingLog}
                >
                  {savingLog ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="airplane-landing" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.landBtnText}>HẠ CÁNH & LƯU HÀNH TRÌNH BAY</Text>
                    </>
                  )}
                </TouchableOpacity>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 40,
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 10,
  },
  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  selectorItemActive: {
    backgroundColor: '#0080FF',
    borderColor: '#0080FF',
  },
  selectorItemText: {
    color: '#0080FF',
    fontSize: 12,
    fontWeight: '500',
  },
  selectorItemTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noPermitCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  noPermitText: {
    flex: 1,
    fontSize: 11,
    color: '#B45309',
    lineHeight: 16,
  },
  warningCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D97706',
  },
  warningDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  startBtn: {
    backgroundColor: '#0080FF',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.8,
  },
  hudCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: 'bold',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hudMainGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  hudCell: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
  },
  hudLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  hudValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 6,
  },
  hudValueAlert: {
    color: '#EF4444',
  },
  hudUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  hudSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  hudAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginTop: 14,
  },
  hudAlertText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: 'bold',
  },
  telemetryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  telTitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  telRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  telLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  telValue: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '600',
  },
  landBtn: {
    backgroundColor: '#EF4444',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: '#F87171',
  },
  landBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.8,
  },
});

export default LiveFlight;
