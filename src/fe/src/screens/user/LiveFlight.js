import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

const LiveFlight = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [drones, setDrones] = useState([]);
  const [permits, setPermits] = useState([]);

  // Selections
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [selectedPermit, setSelectedPermit] = useState(null); // null means "Bay thử nghiệm tự do không phép"

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
      const limit = selectedPermit ? 135 : 45; // Go slightly above safety limits to show warnings
      
      setAltitude((prev) => {
        if (prev < limit) return prev + Math.floor(Math.random() * 8) + 4;
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
      const startTimeISO = new Date(Date.now() - flightTime * 1000).toISOString();
      const endTimeISO = new Date().toISOString();

      const payload = {
        drone_id: selectedDrone.id,
        permit_id: selectedPermit ? selectedPermit.id : null,
        start_time: startTimeISO,
        end_time: endTimeISO,
        max_altitude: altitude,
        distance: distance,
      };

      const response = await axiosClient.post('/flight/logs', payload);
      if (response.data?.success) {
        let violationNote = "";
        
        // Show simulated warnings based on backend checks
        const ceiling = selectedPermit ? 120 : 30;
        if (altitude > ceiling) {
          violationNote = "\n\n⚠️ Phát hiện vi phạm trần bay an toàn! Hệ thống đã tự động lập biên bản phạt gửi đến cơ quan quản lý.";
        } else if (selectedPermit && selectedPermit.zone?.zone_type === 'forbidden') {
          violationNote = "\n\n⚠️ Phát hiện vi phạm vùng cấm bay! Biên bản vi phạm hành chính đã được lập tự động.";
        }

        Alert.alert(
          'Đã Hạ Cánh & Lưu Hành Trình',
          `Hạ cánh an toàn. Đã đồng bộ nhật ký bay thành công!\n\n• Độ cao cực đại: ${altitude} m\n• Quãng đường: ${distance} km\n• Thời gian: ${formatTime(flightTime)}${violationNote}`,
          [{ text: 'Xem lịch sử bay', onPress: () => navigation.navigate('FlightLogs') }]
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Đồng bộ thất bại', error.response?.data?.message || 'Hệ thống ngoại tuyến. Hành trình chưa thể lưu.');
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

  const currentCeiling = selectedPermit ? 120 : 30;
  const isAltWarning = altitude > currentCeiling;
  const isForbiddenZone = selectedPermit?.zone?.zone_type === 'forbidden';
  const isRestrictedZone = selectedPermit?.zone?.zone_type === 'restricted';

  // Filter permits to matching drone
  const availablePermits = permits.filter(
    (p) => !selectedDrone || p.drone_id === selectedDrone.id
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0080FF" />
      </View>
    );
  }

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
                {/* Intro card */}
                <View style={styles.introCard}>
                  <View style={styles.introIconBg}>
                    <Ionicons name="navigate-outline" size={24} color="#0080FF" />
                  </View>
                  <View style={styles.introTextCol}>
                    <Text style={styles.introTitle}>Trình giả lập bay thực địa</Text>
                    <Text style={styles.introDesc}>
                      Kết nối thiết bị và gửi dữ liệu GPS thời gian thực về máy chủ hệ thống UAV ID để giám sát hành trình.
                    </Text>
                  </View>
                </View>

                {/* CONFIG CARD */}
                <View style={styles.configCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="airplane-outline" size={16} color="#0080FF" />
                    <Text style={styles.sectionTitle}>CẤU HÌNH THIẾT BỊ VÀ PHÉP BAY</Text>
                  </View>
                  <View style={styles.divider} />

                  <Text style={styles.inputLabel}>Chọn UAV thực hiện cất cánh *</Text>
                  {drones.length === 0 ? (
                    <Text style={styles.noDronesText}>Bạn chưa đăng ký UAV nào.</Text>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.horizontalScroll}
                      contentContainerStyle={{ paddingVertical: 4 }}
                    >
                      {drones.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.chipItem,
                            selectedDrone?.id === item.id && styles.chipItemActive,
                          ]}
                          onPress={() => {
                            setSelectedDrone(item);
                            setSelectedPermit(null); // Reset permit
                          }}
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons
                            name="drone"
                            size={16}
                            color={selectedDrone?.id === item.id ? '#0080FF' : '#64748B'}
                            style={{ marginRight: 6 }}
                          />
                          <Text
                            style={[
                              styles.chipItemText,
                              selectedDrone?.id === item.id && styles.chipItemTextActive,
                            ]}
                          >
                            {item.model_name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}

                  <Text style={styles.inputLabel}>Chọn Giấy Phép Bay Áp Dụng *</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={{ paddingVertical: 4 }}
                  >
                    {/* Option: Bay tự do thử nghiệm */}
                    <TouchableOpacity
                      style={[
                        styles.chipItem,
                        selectedPermit === null && styles.chipItemActive,
                      ]}
                      onPress={() => setSelectedPermit(null)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="leaf-outline"
                        size={14}
                        color={selectedPermit === null ? '#0080FF' : '#64748B'}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.chipItemText,
                          selectedPermit === null && styles.chipItemTextActive,
                        ]}
                      >
                        Bay tự do thử nghiệm (Không giấy phép)
                      </Text>
                    </TouchableOpacity>

                    {availablePermits.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.chipItem,
                          selectedPermit?.id === item.id && styles.chipItemActive,
                        ]}
                        onPress={() => setSelectedPermit(item)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={14}
                          color={selectedPermit?.id === item.id ? '#0080FF' : '#64748B'}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.chipItemText,
                            selectedPermit?.id === item.id && styles.chipItemTextActive,
                          ]}
                        >
                          GP-{item.id} ({item.zone?.name || 'Khu vực bay'})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {selectedPermit === null ? (
                    <View style={styles.infoCardNote}>
                      <Ionicons name="information-circle-outline" size={16} color="#0284C7" />
                      <Text style={styles.infoCardNoteText}>
                        Bạn đang chọn chế độ Bay thử nghiệm tự do. Trần bay an toàn tối đa cho phép là **30m**. Vượt quá sẽ bị ghi nhận vi phạm không phép.
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.infoCardNote, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }]}>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#16A34A" />
                      <Text style={[styles.infoCardNoteText, { color: '#166534' }]}>
                        Áp dụng giấy phép GP-{selectedPermit.id}. Trần bay quy định tại vùng "{selectedPermit.zone?.name}": **120m**.
                      </Text>
                    </View>
                  )}
                </View>

                {/* SAFETY BRIEFING */}
                <View style={styles.warningCard}>
                  <View style={styles.warningHeader}>
                    <Ionicons name="shield-alert-outline" size={20} color="#D97706" />
                    <Text style={styles.warningTitle}>QUY TẮC AN TOÀN KHÔNG PHẬN</Text>
                  </View>
                  <Text style={styles.warningDesc}>
                    Thiết bị giám sát hành trình thực địa sẽ liên tục đồng bộ dữ liệu tọa độ GPS, độ cao và tốc độ bay lên máy chủ trung tâm. Mọi vi phạm về trần bay hoặc vùng cấm bay sẽ được tự động báo cáo biên bản xử lý trực tiếp.
                  </Text>
                </View>

                <TouchableOpacity style={styles.startBtn} onPress={startFlightSimulation}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.startBtnGradient}
                  >
                    <Ionicons name="rocket-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.startBtnText}>KÍCH HOẠT CHUYẾN BẮT ĐẦU BAY</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* HUD PANEL */}
                <View style={styles.hudCard}>
                  <View style={styles.hudHeader}>
                    <View style={styles.liveTag}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>GPS TELEMETRY LIVE</Text>
                    </View>
                    <Text style={styles.timerText}>{formatTime(flightTime)}</Text>
                  </View>

                  <View style={styles.hudMainGrid}>
                    <View style={styles.hudCell}>
                      <Text style={styles.hudLabel}>ĐỘ CAO THỰC TẾ</Text>
                      <Text style={[styles.hudValue, isAltWarning && styles.hudValueAlert]}>
                        {altitude} <Text style={styles.hudUnit}>m</Text>
                      </Text>
                      <View style={styles.progressContainer}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${Math.min(100, (altitude / currentCeiling) * 100)}%`,
                              backgroundColor: isAltWarning ? '#EF4444' : '#10B981',
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.hudSub}>Giới hạn: {currentCeiling}m</Text>
                    </View>

                    <View style={styles.hudCell}>
                      <Text style={styles.hudLabel}>QUÃNG ĐƯỜNG ĐÃ BAY</Text>
                      <Text style={styles.hudValue}>
                        {distance.toFixed(3)} <Text style={styles.hudUnit}>km</Text>
                      </Text>
                      <Text style={styles.hudSub}>Tốc độ: {speed} km/h</Text>
                    </View>
                  </View>

                  {/* Warning Alerts */}
                  {isAltWarning && (
                    <View style={styles.hudAlertBox}>
                      <Ionicons name="warning" size={18} color="#EF4444" />
                      <Text style={styles.hudAlertText}>
                        CẢNH BÁO: BẠN ĐANG VƯỢT QUÁ TRẦN BAY CHO PHÉP ({currentCeiling}M)!
                      </Text>
                    </View>
                  )}

                  {isForbiddenZone && (
                    <View style={[styles.hudAlertBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                      <Ionicons name="alert-circle" size={18} color="#EF4444" />
                      <Text style={styles.hudAlertText}>
                        ⚠️ NGUY HIỂM: ĐANG BAY TRONG PHẠM VI VÙNG CẤM BAY!
                      </Text>
                    </View>
                  )}

                  {isRestrictedZone && !isAltWarning && (
                    <View style={[styles.hudAlertBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                      <Ionicons name="alert" size={18} color="#F59E0B" />
                      <Text style={[styles.hudAlertText, { color: '#F59E0B' }]}>
                        Chú ý: Đang bay trong khu vực hạn chế. Vui lòng bay cẩn thận.
                      </Text>
                    </View>
                  )}
                </View>

                {/* COORDINATES & TELEMETRY */}
                <View style={styles.telemetryCard}>
                  <Text style={styles.telTitle}>CHI TIẾT ĐỊNH VỊ THỰC ĐỊA</Text>
                  <View style={styles.divider} />

                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Thiết bị UAV:</Text>
                    <Text style={styles.telValue}>{selectedDrone?.model_name}</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Mã định danh S/N:</Text>
                    <Text style={styles.telValue}>{selectedDrone?.serial_number}</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Tọa độ GPS Vĩ độ (Latitude):</Text>
                    <Text style={styles.telValue}>{lat.toFixed(6)}</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Tọa độ GPS Kinh độ (Longitude):</Text>
                    <Text style={styles.telValue}>{lng.toFixed(6)}</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Tín hiệu vệ tinh kết nối:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="cellular" size={14} color="#10B981" />
                      <Text style={[styles.telValue, { color: '#10B981' }]}>{satellites} Vệ tinh</Text>
                    </View>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Sức gió hiện tại:</Text>
                    <Text style={styles.telValue}>{windSpeed} m/s</Text>
                  </View>
                  <View style={styles.telRow}>
                    <Text style={styles.telLabel}>Bảo mật mã hóa kênh truyền:</Text>
                    <Text style={[styles.telValue, { color: '#0080FF' }]}>SSL WPA3-Enterprise</Text>
                  </View>
                </View>

                {/* LANDING ACTION BUTTON */}
                <TouchableOpacity
                  style={styles.landBtn}
                  onPress={handleLandAndSave}
                  disabled={savingLog}
                  activeOpacity={0.8}
                >
                  {savingLog ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <LinearGradient
                      colors={['#EF4444', '#DC2626']}
                      style={styles.landBtnGradient}
                    >
                      <Ionicons name="arrow-down-circle" size={22} color="#FFFFFF" />
                      <Text style={styles.landBtnText}>HẠ CÁNH & ĐỒNG BỘ NHẬT KÝ BAY</Text>
                    </LinearGradient>
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
  introCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  introIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  introTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  introDesc: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
    lineHeight: 16,
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 8,
  },
  horizontalScroll: {
    marginBottom: 16,
    paddingBottom: 4,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipItemActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0080FF',
  },
  chipItemText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
  },
  chipItemTextActive: {
    color: '#0080FF',
    fontWeight: 'bold',
  },
  noDronesText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 16,
  },
  infoCardNote: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    alignItems: 'center',
  },
  infoCardNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 18,
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
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  startBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
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
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  hudValue: {
    color: '#FFFFFF',
    fontSize: 26,
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
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  hudSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  hudAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  hudAlertText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  telemetryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  telTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  telRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  telLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  telValue: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '600',
  },
  landBtn: {
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  landBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  landBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.8,
  },
});

export default LiveFlight;
