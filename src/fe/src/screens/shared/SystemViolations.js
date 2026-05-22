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
  TextInput,
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

const SystemViolations = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid', 'paid', 'all'
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination & Refresh States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchViolations = async (pageNum = 1, isRefresh = false) => {
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
      const statusParam = activeTab === 'all' ? '' : `&status=${activeTab}`;
      const queryParam = searchQuery.trim() ? `&q=${encodeURIComponent(searchQuery.trim())}` : '';
      
      const response = await axiosClient.get(
        `/violations?page=${pageNum}&limit=10${statusParam}${queryParam}`
      );
      
      const newData = response.data?.data || [];
      const meta = response.data?.meta;

      if (pageNum === 1) {
        setViolations(newData);
      } else {
        setViolations((prev) => [...prev, ...newData]);
      }

      if (meta) {
        setHasMore(pageNum < meta.totalPages);
      } else {
        setHasMore(newData.length >= 10);
      }
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách vi phạm.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchViolations(1, false);
  }, [activeTab]);

  // Handle focus (e.g. returning from details after payment update)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchViolations(1, false);
    });
    return unsubscribe;
  }, [navigation, activeTab, searchQuery]);

  const handleRefresh = () => {
    fetchViolations(1, true);
  };

  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    fetchViolations(page + 1, false);
  };

  const handleSearch = () => {
    fetchViolations(1, false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // Trigger fetch on next tick or directly
    setTimeout(() => {
      fetchViolations(1, false);
    }, 50);
  };

  const renderViolationItem = ({ item }) => {
    const isUnpaid = item.status === 'unpaid';
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ViolationDetail', { violationId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleContainer}>
            <Ionicons
              name={isUnpaid ? 'warning' : 'checkmark-circle'}
              size={20}
              color={isUnpaid ? '#EF4444' : '#10B981'}
            />
            <Text style={styles.violationType} numberOfLines={1}>
              {item.violation_type}
            </Text>
          </View>
          <Text style={[styles.fineAmount, { color: isUnpaid ? '#EF4444' : '#10B981' }]}>
            {formatCurrency(item.fine_amount)}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.cardDetails}>
          <Text style={styles.detailsText}>
            <Text style={styles.boldText}>Thiết bị:</Text> {item.drone?.model_name || 'Không rõ'} ({item.drone?.serial_number || 'S/N N/A'})
          </Text>
          <Text style={styles.detailsText}>
            <Text style={styles.boldText}>Chủ sở hữu:</Text> {item.user?.full_name || 'Không rõ'} ({item.user?.email || 'N/A'})
          </Text>
          <Text style={styles.detailsText}>
            <Text style={styles.boldText}>Ngày ghi nhận:</Text>{' '}
            {item.date_recorded ? new Date(item.date_recorded).toLocaleString('vi-VN') : 'N/A'}
          </Text>
          
          <View style={styles.cardFooter}>
            <View style={[styles.statusBadge, isUnpaid ? styles.statusUnpaid : styles.statusPaid]}>
              <Text style={[styles.statusText, isUnpaid ? styles.statusUnpaidText : styles.statusPaidText]}>
                {isUnpaid ? 'CHƯA THANH TOÁN' : 'ĐÃ NỘP PHẠT'}
              </Text>
            </View>
            <View style={styles.viewDetailLink}>
              <Text style={styles.viewDetailLinkText}>Xem chi tiết</Text>
              <Ionicons name="chevron-forward" size={14} color="#0080FF" />
            </View>
          </View>
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
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Hồ Sơ Vi Phạm Toàn Hệ Thống</Text>
          </View>

          {/* SEARCH BAR */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm loại vi phạm, mô tả..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Text style={styles.searchBtnText}>Tìm</Text>
            </TouchableOpacity>
          </View>

          {/* TABS */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'unpaid' && styles.activeTabItem]}
              onPress={() => setActiveTab('unpaid')}
            >
              <Text style={[styles.tabText, activeTab === 'unpaid' && styles.activeTabText]}>
                Chưa nộp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'paid' && styles.activeTabItem]}
              onPress={() => setActiveTab('paid')}
            >
              <Text style={[styles.tabText, activeTab === 'paid' && styles.activeTabText]}>
                Đã nộp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'all' && styles.activeTabItem]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                Tất cả
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
              onRefresh={handleRefresh}
              refreshing={refreshing}
              onEndReached={loadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={
                loadingMore ? (
                  <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="#0080FF" />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
                  <Text style={styles.emptyText}>Không tìm thấy biên bản vi phạm nào.</Text>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  searchBtn: {
    backgroundColor: '#0080FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    marginRight: 8,
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
  viewDetailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailLinkText: {
    color: '#0080FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerLoader: {
    marginVertical: 16,
    alignItems: 'center',
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

export default SystemViolations;
