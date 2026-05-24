import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

const ApproveFlightPermits = ({ navigation }) => {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchPermits = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/flight/permits?status=${activeTab}`);
      setPermits(response.data?.data || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách giấy phép bay.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, [activeTab]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPermits();
    });
    return unsubscribe;
  }, [navigation, activeTab]);

  const renderPermitItem = ({ item }) => {
    const isForbiddenZone = item.zone?.zone_type === 'forbidden';
    const isRestrictedZone = item.zone?.zone_type === 'restricted';
    const statusLabel = item.status === 'approved' ? 'Đã duyệt' : item.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt';
    const statusColor = item.status === 'approved' ? '#10B981' : item.status === 'rejected' ? '#EF4444' : '#0080FF';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('FlightPermitDetail', { permitId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.modelName}>{item.drone?.model_name || 'UAV Device'}</Text>
              <View style={[
                styles.zoneBadge,
                isForbiddenZone ? styles.zoneForbidden :
                isRestrictedZone ? styles.zoneRestricted : styles.zoneFree
              ]}>
                <Text style={[
                  styles.zoneBadgeText,
                  isForbiddenZone ? styles.zoneForbiddenText :
                  isRestrictedZone ? styles.zoneRestrictedText : styles.zoneFreeText
                ]}>
                  {item.zone?.name || 'Vùng bay tự do'}
                </Text>
              </View>
            </View>
            <Text style={styles.serialNumber}>S/N: {item.drone?.serial_number}</Text>
            <Text style={styles.ownerText}>Người khai báo: {item.user?.full_name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <View style={[styles.dot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusTextLabel, { color: statusColor }]}>
                {statusLabel.toUpperCase()}
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#64748B"
          />
        </View>
      </TouchableOpacity>
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
            {navigation.canGoBack() && (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#0F172A" />
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>Duyệt Cấp Phép Chuyến Bay</Text>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'pending' && styles.activeTabItem]}
              onPress={() => setActiveTab('pending')}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                Đang chờ duyệt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'approved' && styles.activeTabItem]}
              onPress={() => setActiveTab('approved')}
            >
              <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>
                Đã phê duyệt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'rejected' && styles.activeTabItem]}
              onPress={() => setActiveTab('rejected')}
            >
              <Text style={[styles.tabText, activeTab === 'rejected' && styles.activeTabText]}>
                Từ chối cấp phép
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0080FF" />
            </View>
          ) : (
            <FlatList
              data={permits}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPermitItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Không tìm thấy yêu cầu cấp phép nào phù hợp</Text>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#0080FF',
  },
  tabText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0080FF',
  },
  loaderContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  zoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  zoneForbidden: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  zoneForbiddenText: {
    color: '#DC2626',
  },
  zoneRestricted: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  zoneRestrictedText: {
    color: '#D97706',
  },
  zoneFree: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0080FF',
  },
  zoneFreeText: {
    color: '#0080FF',
  },
  zoneBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  serialNumber: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
  },
  ownerText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  cardDetails: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  detailValue: {
    color: '#1E293B',
    fontSize: 13,
  },
  riskCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 12,
  },
  riskTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  riskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  riskLabel: {
    fontSize: 11,
    color: '#475569',
  },
  riskVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  noteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noteTitle: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noteContent: {
    color: '#475569',
    fontSize: 12,
    marginTop: 4,
  },
  actionContainer: {
    marginTop: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#0080FF',
  },
  rejectBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rejectForm: {
    marginTop: 8,
  },
  reasonInput: {
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  submitRejectBtn: {
    backgroundColor: '#EF4444',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
});

export default ApproveFlightPermits;
