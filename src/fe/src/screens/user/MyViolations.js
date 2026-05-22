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
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Cảnh cáo';
  const numericAmount = Math.round(parseFloat(amount));
  if (numericAmount === 0) return 'Cảnh cáo';
  return numericAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ';
};

const MyViolations = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('unpaid');
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/violations?status=${activeTab}`);
      setViolations(response.data?.data || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải biên bản vi phạm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, [activeTab]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchViolations();
    });
    return unsubscribe;
  }, [navigation, activeTab]);

  const handlePayMock = (item) => {
    Alert.alert(
      'Thanh toán điện tử',
      `Bạn đang thực hiện nộp phạt trực tuyến cho lỗi [${item.violation_type}] với số tiền ${formatCurrency(item.fine_amount)}.\n\nHệ thống sẽ chuyển hướng đến cổng dịch vụ công.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận nộp',
          onPress: async () => {
            try {
              // Call API to mark violation as paid
              const response = await axiosClient.put(`/violations/${item.id}/pay`);
              if (response.data?.success) {
                Alert.alert(
                  'Thành công',
                  'Đã hoàn tất thanh toán biên lai xử phạt hành chính trực tuyến!',
                  [{ text: 'OK', onPress: () => fetchViolations() }]
                );
              } else {
                Alert.alert('Lỗi', 'Không thể cập nhật trạng thái thanh toán.');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Thao tác nộp phạt gặp lỗi kết nối.');
            }
          },
        },
      ]
    );
  };

  const renderViolationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ViolationDetail', { violationId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerTitleContainer}>
          <Ionicons
            name={activeTab === 'unpaid' ? 'warning' : 'checkmark-circle'}
            size={20}
            color={activeTab === 'unpaid' ? '#EF4444' : '#10B981'}
          />
          <Text style={styles.violationType}>{item.violation_type}</Text>
        </View>
        <Text style={[styles.fineAmount, { color: activeTab === 'unpaid' ? '#EF4444' : '#10B981' }]}>
          {formatCurrency(item.fine_amount)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardDetails}>
        <Text style={styles.detailsText}>
          <Text style={styles.boldText}>Thiết bị vi phạm:</Text> {item.drone?.model_name || `UAV #${item.drone_id}`}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.boldText}>Ngày ghi nhận:</Text>{' '}
          {item.date_recorded ? new Date(item.date_recorded).toLocaleDateString('vi-VN') : 'N/A'}
        </Text>
        {item.description && (
          <Text style={styles.descriptionBox}>{item.description}</Text>
        )}
      </View>

      {activeTab === 'unpaid' && item.fine_amount > 0 && (
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => navigation.navigate('ViolationDetail', { violationId: item.id })}
        >
          <Ionicons name="card-outline" size={18} color="#FFFFFF" />
          <Text style={styles.payBtnText}>Xem chi tiết & Nộp phạt</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

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
            <Text style={styles.headerTitle}>Vi Phạm & Nộp Phạt</Text>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'unpaid' && styles.activeTabItem]}
              onPress={() => setActiveTab('unpaid')}
            >
              <Text style={[styles.tabText, activeTab === 'unpaid' && styles.activeTabText]}>
                Chưa xử lý
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'paid' && styles.activeTabItem]}
              onPress={() => setActiveTab('paid')}
            >
              <Text style={[styles.tabText, activeTab === 'paid' && styles.activeTabText]}>
                Đã xử lý / Đã nộp
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0080FF" />
            </View>
          ) : (
            <FlatList
              data={violations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderViolationItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Tuyệt vời! Không có biên bản vi phạm nào.</Text>
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
    fontSize: 14,
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
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  violationType: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fineAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardDetails: {},
  detailsText: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 6,
  },
  boldText: {
    color: '#1E293B',
    fontWeight: 'bold',
  },
  descriptionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    color: '#475569',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  payBtn: {
    backgroundColor: '#0080FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
  },
});

export default MyViolations;
