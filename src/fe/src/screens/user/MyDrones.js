import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

const MyDrones = ({ navigation }) => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [qrCodes, setQrCodes] = useState({});
  const [qrLoading, setQrLoading] = useState({});

  const fetchDrones = async () => {
    try {
      const response = await axiosClient.get('/drones');
      setDrones(response.data?.data || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách thiết bị UAV.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();
  }, []);

  const handleFetchQr = async (droneId, regId) => {
    if (!regId) return;
    if (qrCodes[droneId]) return;

    setQrLoading((prev) => ({ ...prev, [droneId]: true }));
    try {
      const response = await axiosClient.get(`/registrations/${regId}/qr`);
      if (response.data?.success && response.data?.data?.qr_code_base64) {
        setQrCodes((prev) => ({
          ...prev,
          [droneId]: response.data.data.qr_code_base64,
        }));
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải mã QR định danh.');
    } finally {
      setQrLoading((prev) => ({ ...prev, [droneId]: false }));
    }
  };

  const toggleExpand = (id, regId) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (regId) {
        handleFetchQr(id, regId);
      }
    }
  };

  const renderDroneItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const reg = item.registration;
    const qrBase64 = qrCodes[item.id];
    const isQrLoading = qrLoading[item.id];

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleExpand(item.id, reg?.id)}
          activeOpacity={0.7}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.modelName}>{item.model_name}</Text>
            <Text style={styles.serialNumber}>S/N: {item.serial_number}</Text>
          </View>
          <View style={styles.headerRight}>
            <View
              style={[
                styles.statusBadge,
                reg?.status === 'approved'
                  ? styles.badgeApproved
                  : reg?.status === 'pending'
                  ? styles.badgePending
                  : styles.badgeNone,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      reg?.status === 'approved'
                        ? '#2E7D32'
                        : reg?.status === 'pending'
                        ? '#EF6C00'
                        : '#C62828',
                  },
                ]}
              >
                {reg?.status === 'approved'
                  ? 'ĐÃ ĐỊNH DANH'
                  : reg?.status === 'pending'
                  ? 'ĐANG DUYỆT'
                  : 'CHƯA ĐĂNG KÝ'}
              </Text>
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#7F8C8D"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.detailsContainer}>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nhà sản xuất:</Text>
              <Text style={styles.infoValue}>{item.manufacturer?.name || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phân loại UAV:</Text>
              <Text style={styles.infoValue}>{item.category?.name || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trọng lượng:</Text>
              <Text style={styles.infoValue}>{item.weight} kg</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trọng trần bay:</Text>
              <Text style={styles.infoValue}>{item.max_flight_height} m</Text>
            </View>

            {reg?.status === 'approved' && (
              <View style={styles.qrContainer}>
                <Text style={styles.qrTitle}>MÃ QR ĐỊNH DANH HỢP LỆ</Text>
                <Text style={styles.qrCodeText}>{reg.identification_code}</Text>
                {isQrLoading ? (
                  <ActivityIndicator size="small" color="#0080FF" style={{ margin: 16 }} />
                ) : qrBase64 ? (
                  <Image source={{ uri: qrBase64 }} style={styles.qrImage} />
                ) : (
                  <Text style={styles.qrErrorText}>Không thể hiển thị hình ảnh QR</Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.detailBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DroneDetail', { droneId: item.id })}
            >
              <Ionicons name="information-circle-outline" size={16} color="#FFFFFF" />
              <Text style={styles.detailBtnText}>Xem chi tiết & lịch sử bay</Text>
            </TouchableOpacity>
          </View>
        )}
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#2C3E50" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>UAV Của Tôi</Text>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0080FF" />
            </View>
          ) : (
            <FlatList
              data={drones}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderDroneItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Chưa có thiết bị UAV nào được đăng ký sở hữu.</Text>
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={() => navigation.navigate('RegisterDrone')}
                  >
                    <Text style={styles.emptyButtonText}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
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
    borderBottomColor: '#E5E7E9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F2F4F4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flex: 1,
  },
  modelName: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serialNumber: {
    color: '#7F8C8D',
    fontSize: 13,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeApproved: {
    backgroundColor: '#E8F5E9',
  },
  badgePending: {
    backgroundColor: '#FFF3E0',
  },
  badgeNone: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECF0F1',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoLabel: {
    color: '#7F8C8D',
    fontSize: 13,
  },
  infoValue: {
    color: '#2C3E50',
    fontSize: 13,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  qrTitle: {
    color: '#0080FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  qrCodeText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 12,
  },
  qrImage: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BDC3C7',
  },
  qrErrorText: {
    color: '#C62828',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 120,
  },
  emptyText: {
    color: '#7F8C8D',
    fontSize: 14,
  },
  emptyButton: {
    backgroundColor: '#0080FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailBtn: {
    backgroundColor: '#0080FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  detailBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default MyDrones;
