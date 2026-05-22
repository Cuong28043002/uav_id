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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

const getStatusDetails = (status) => {
  switch (status) {
    case 'approved':
      return {
        label: 'HIỆU LỰC',
        style: styles.statusApproved,
        textStyle: styles.statusApprovedText,
      };
    case 'revoked':
      return {
        label: 'THU HỒI / HỦY',
        style: styles.statusRevoked,
        textStyle: styles.statusRevokedText,
      };
    case 'pending':
      return {
        label: 'CHỜ PHÊ DUYỆT',
        style: styles.statusPending,
        textStyle: styles.statusPendingText,
      };
    case 'rejected':
      return {
        label: 'BỊ TỪ CHỐI',
        style: styles.statusRejected,
        textStyle: styles.statusRejectedText,
      };
    default:
      return {
        label: 'KHÔNG XÁC ĐỊNH',
        style: styles.statusInactive,
        textStyle: styles.statusInactiveText,
      };
  }
};

const SearchDrones = ({ route, navigation }) => {
  const params = route?.params || {};
  const [code, setCode] = useState(params.identification_code || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axiosClient.get('/lookup-history?limit=5');
      setHistory(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching lookup history:', error);
    }
  };

  const handleSearch = async (forcedCode) => {
    const searchCode = (forcedCode || code).trim();
    if (!searchCode) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã định danh hoặc số S/N của UAV.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await axiosClient.get(`/lookup/${searchCode}`);
      if (response.data?.success) {
        setResult(response.data.data);
        fetchHistory().catch(() => {});
      } else {
        Alert.alert('Không tìm thấy', 'Không tìm thấy thiết bị UAV khớp với mã định danh hoặc số S/N này.');
      }
    } catch (error) {
      Alert.alert('Không tìm thấy', 'Mã định danh hoặc số S/N không tồn tại hoặc hệ thống gặp lỗi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (params.identification_code) {
      setCode(params.identification_code);
      handleSearch(params.identification_code);
    }
  }, [params.identification_code]);

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
            <Text style={styles.headerTitle}>Tra Cứu UAV Quốc Gia</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.searchSection}>
              <Text style={styles.inputLabel}>Nhập mã định danh hoặc số S/N của UAV</Text>
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Ví dụ: UAV-ABC123-XY9Z hoặc S/N..."
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  value={code}
                  onChangeText={setCode}
                />
                {!!code && (
                  <TouchableOpacity 
                    style={[styles.searchBtn, { backgroundColor: '#F1F5F9', marginRight: 4 }]} 
                    onPress={() => {
                      setCode('');
                      setResult(null);
                    }}
                  >
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.searchBtn, { backgroundColor: '#F1F5F9' }]} 
                  onPress={() => navigation.navigate('QRScanner')}
                >
                  <Ionicons name="qr-code-outline" size={20} color="#0080FF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch()}>
                  <Ionicons name="search" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {!result && !loading && (
              <View style={styles.historySection}>
                <Text style={styles.historySectionTitle}>Lịch sử tra cứu gần đây</Text>
                {history.length > 0 ? (
                  history.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.historyCard}
                      activeOpacity={0.7}
                      onPress={() => {
                        setCode(item.identification_code);
                        handleSearch(item.identification_code);
                      }}
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
                  ))
                ) : (
                  <Text style={styles.noHistoryText}>Chưa có lịch sử tra cứu nào</Text>
                )}
              </View>
            )}

            {loading && (
              <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 40 }} />
            )}

            {result && (
              <View style={styles.resultContainer}>
                {(() => {
                  let headerTitle = 'KẾT QUẢ ĐỊNH DANH';
                  let headerColor = '#64748B';
                  let iconName = 'help-circle';

                  if (result.status === 'approved') {
                    headerTitle = 'KẾT QUẢ ĐỊNH DANH HỢP LỆ';
                    headerColor = '#10B981';
                    iconName = 'checkmark-circle';
                  } else if (result.status === 'revoked') {
                    headerTitle = 'KẾT QUẢ ĐỊNH DANH ĐÃ BỊ THU HỒI';
                    headerColor = '#EF4444';
                    iconName = 'alert-circle';
                  } else if (result.status === 'pending') {
                    headerTitle = 'KẾT QUẢ ĐỊNH DANH CHỜ DUYỆT';
                    headerColor = '#3B82F6';
                    iconName = 'time';
                  } else if (result.status === 'rejected') {
                    headerTitle = 'KẾT QUẢ ĐỊNH DANH BỊ TỪ CHỐI';
                    headerColor = '#F97316';
                    iconName = 'close-circle';
                  }

                  return (
                    <View style={styles.resultHeader}>
                      <Ionicons name={iconName} size={26} color={headerColor} />
                      <Text style={[styles.resultHeaderTitle, { color: headerColor }]}>
                        {headerTitle}
                      </Text>
                    </View>
                  );
                })()}

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionCardTitle}>Thông tin thiết bị</Text>
                  
                  {/* Drone Image List */}
                  {(() => {
                    let droneImages = [];
                    if (result.drone?.images) {
                      if (Array.isArray(result.drone.images)) {
                        droneImages = result.drone.images;
                      } else if (typeof result.drone.images === 'string') {
                        try {
                          droneImages = JSON.parse(result.drone.images);
                        } catch (e) {
                          droneImages = [];
                        }
                      }
                    }

                    if (droneImages && droneImages.length > 0) {
                      return (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.imageScrollContainer}
                        >
                          {droneImages.map((imgUrl, index) => (
                            <Image
                              key={index}
                              source={{ uri: imgUrl }}
                              style={[
                                styles.droneImage,
                                index < droneImages.length - 1 && { marginRight: 12 }
                              ]}
                              resizeMode="cover"
                            />
                          ))}
                        </ScrollView>
                      );
                    } else {
                      return (
                        <View style={styles.placeholderImageContainer}>
                          <Ionicons name="airplane-outline" size={40} color="#94A3B8" />
                          <Text style={styles.placeholderImageText}>Không có hình ảnh thiết bị</Text>
                        </View>
                      );
                    }
                  })()}

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Mã định danh:</Text>
                    <Text style={[styles.infoValue, { color: '#0080FF', fontWeight: 'bold' }]}>
                      {result.identification_code || 'Chưa cấp phát'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Dòng máy bay:</Text>
                    <Text style={styles.infoValue}>{result.drone?.model_name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Số S/N:</Text>
                    <Text style={styles.infoValue}>{result.drone?.serial_number}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Trọng lượng:</Text>
                    <Text style={styles.infoValue}>{result.drone?.weight} kg</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Trạng thái định danh:</Text>
                    {(() => {
                      const statusDetails = getStatusDetails(result.status);
                      return (
                        <View style={[styles.statusBadge, statusDetails.style]}>
                          <Text style={[styles.statusBadgeText, statusDetails.textStyle]}>
                            {statusDetails.label}
                          </Text>
                        </View>
                      );
                    })()}
                  </View>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionCardTitle}>Chủ sở hữu</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Họ và tên:</Text>
                    <Text style={styles.infoValue}>{result.drone?.owner?.full_name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email liên hệ:</Text>
                    <Text style={styles.infoValue}>{result.drone?.owner?.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Số điện thoại:</Text>
                    <Text style={styles.infoValue}>{result.drone?.owner?.phone || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Số CCCD:</Text>
                    <Text style={styles.infoValue}>{result.drone?.owner?.cccd_number || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.inspectionBtn]}
                    onPress={() =>
                      navigation.navigate('InspectionScreen', {
                        droneId: result.drone_id,
                        serialNumber: result.drone?.serial_number,
                      })
                    }
                  >
                    <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Lập biên bản kiểm tra</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.violationBtn]}
                    onPress={() =>
                      navigation.navigate('ReportViolation', {
                        droneId: result.drone_id,
                        userId: result.drone?.owner?.id,
                        serialNumber: result.drone?.serial_number,
                        ownerName: result.drone?.owner?.full_name,
                      })
                    }
                  >
                    <Ionicons name="warning" size={20} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Ghi nhận vi phạm</Text>
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
    padding: 20,
  },
  searchSection: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    paddingLeft: 16,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
  },
  searchBtn: {
    width: 50,
    height: '100%',
    backgroundColor: '#0080FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    marginTop: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultHeaderTitle: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionCardTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  infoValue: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusApproved: {
    backgroundColor: '#D1FAE5',
  },
  statusApprovedText: {
    color: '#065F46',
  },
  statusRevoked: {
    backgroundColor: '#FEE2E2',
  },
  statusRevokedText: {
    color: '#991B1B',
  },
  statusPending: {
    backgroundColor: '#DBEAFE',
  },
  statusPendingText: {
    color: '#1E40AF',
  },
  statusRejected: {
    backgroundColor: '#FFEDD5',
  },
  statusRejectedText: {
    color: '#9A3412',
  },
  statusInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusInactiveText: {
    color: '#475569',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  imageScrollContainer: {
    paddingVertical: 10,
    marginBottom: 12,
  },
  droneImage: {
    width: 280,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  placeholderImageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  placeholderImageText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 8,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 10,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inspectionBtn: {
    backgroundColor: '#FF9500',
    shadowColor: '#FF9500',
  },
  violationBtn: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  historySection: {
    marginTop: 20,
    marginBottom: 30,
  },
  historySectionTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyInfo: {
    flex: 1,
  },
  historyCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  historyTime: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  ipBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  noHistoryText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default SearchDrones;
