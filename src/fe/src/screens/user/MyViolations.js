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
  ScrollView,
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDroneId, setFilterDroneId] = useState(null);
  const [drones, setDrones] = useState([]);

  const fetchMetadata = async () => {
    try {
      const dronesRes = await axiosClient.get('/drones');
      setDrones(dronesRes.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchViolations = async (pageNum, isRefresh = false) => {
    if (pageNum === 1) {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
    } else {
      setLoadingMore(true);
    }

    try {
      const params = {
        status: activeTab,
        page: pageNum,
        limit: 10,
      };
      if (filterDroneId) {
        params.drone_id = filterDroneId;
      }

      const response = await axiosClient.get('/violations', { params });
      const data = response.data?.data || [];

      if (pageNum === 1) {
        setViolations(data);
      } else {
        setViolations((prev) => {
          const merged = [...prev];
          data.forEach((item) => {
            if (!merged.some((existing) => existing.id === item.id)) {
              merged.push(item);
            }
          });
          return merged;
        });
      }

      setHasMore(data.length === 10);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải biên bản vi phạm.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchViolations(1);
  }, [activeTab, filterDroneId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPage(1);
      fetchViolations(1);
    });
    return unsubscribe;
  }, [navigation, activeTab, filterDroneId]);

  const handleRefresh = () => {
    setPage(1);
    fetchViolations(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchViolations(nextPage);
    }
  };

  // Local filtering based on search query
  const filteredViolations = violations.filter((item) => {
    const type = (item.violation_type || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const model = (item.drone?.model_name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return type.includes(query) || desc.includes(query) || model.includes(query);
  });

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
          <Text style={styles.descriptionBox} numberOfLines={2}>{item.description}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.detailBtn}
        onPress={() => navigation.navigate('ViolationDetail', { violationId: item.id })}
      >
        <Ionicons name="eye-outline" size={16} color="#0080FF" />
        <Text style={styles.detailBtnText}>Xem chi tiết biên bản</Text>
      </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Vi Phạm & Xử Phạt</Text>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'unpaid' && styles.activeTabItem]}
              onPress={() => setActiveTab('unpaid')}
            >
              <Text style={[styles.tabText, activeTab === 'unpaid' && styles.activeTabText]}>
                Chưa thanh toán
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'paid' && styles.activeTabItem]}
              onPress={() => setActiveTab('paid')}
            >
              <Text style={[styles.tabText, activeTab === 'paid' && styles.activeTabText]}>
                Đã nộp phạt
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search & Filter Bar */}
          <View style={styles.searchFilterWrapper}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm lỗi hoặc thiết bị..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Horizontal scroll select Drone */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterChipScroll}
              contentContainerStyle={styles.filterChipScrollContent}
            >
              <TouchableOpacity
                style={[styles.filterChip, !filterDroneId && styles.filterChipActive]}
                onPress={() => setFilterDroneId(null)}
              >
                <Text style={[styles.filterChipText, !filterDroneId && styles.filterChipTextActive]}>
                  Tất cả UAV
                </Text>
              </TouchableOpacity>
              {drones.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.filterChip, filterDroneId === d.id && styles.filterChipActive]}
                  onPress={() => setFilterDroneId(d.id)}
                >
                  <Text style={[styles.filterChipText, filterDroneId === d.id && styles.filterChipTextActive]}>
                    {d.model_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {loading && page === 1 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0080FF" />
            </View>
          ) : (
            <FlatList
              data={filteredViolations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderViolationItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={
                loadingMore ? (
                  <View style={{ paddingVertical: 12 }}>
                    <ActivityIndicator color="#0080FF" />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="shield-checkmark-outline" size={48} color="#94A3B8" />
                  <Text style={styles.emptyText}>Tuyệt vời! Không phát hiện biên bản vi phạm nào.</Text>
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
  searchFilterWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 13,
    padding: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterChipScroll: {
    paddingLeft: 16,
  },
  filterChipScrollContent: {
    paddingRight: 32,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0080FF',
  },
  filterChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#0080FF',
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
    flex: 1,
  },
  fineAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
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
  detailBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
    gap: 6,
  },
  detailBtnText: {
    color: '#0080FF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 12,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default MyViolations;
