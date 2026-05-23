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
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

const { width, height } = Dimensions.get('window');

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Cảnh cáo';
  const numericAmount = Math.round(parseFloat(amount));
  if (numericAmount === 0) return 'Cảnh cáo';
  return numericAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ';
};

const CustomDatePickerModal = ({ visible, onClose, onSelect, value }) => {
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState(parseDate(value));

  useEffect(() => {
    if (visible) {
      setCurrentDate(parseDate(value));
    }
  }, [visible, value]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const getDaysInMonth = (y, m) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y, m) => {
    return new Date(y, m, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    onSelect(dateStr);
  };

  const grid = [];
  const emptySlots = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < emptySlots; i++) {
    grid.push(<View key={`empty-${i}`} style={styles.gridCellEmpty} />);
  }

  const selectedParsed = value ? parseDate(value) : null;
  const isSelected = (day) => {
    if (!selectedParsed) return false;
    return (
      selectedParsed.getFullYear() === year &&
      selectedParsed.getMonth() === month &&
      selectedParsed.getDate() === day
    );
  };

  for (let d = 1; d <= daysInMonth; d++) {
    const active = isSelected(d);
    grid.push(
      <TouchableOpacity
        key={`day-${d}`}
        style={[styles.gridCell, active && styles.gridCellActive]}
        onPress={() => handleSelectDay(d)}
      >
        <Text style={[styles.gridCellText, active && styles.gridCellTextActive]}>{d}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => setCurrentDate(new Date(year - 1, month, 1))} style={styles.navBtn}>
              <Ionicons name="play-back" size={16} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={18} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.pickerMonthTitle}>{monthNames[month]} - {year}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={18} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentDate(new Date(year + 1, month, 1))} style={styles.navBtn}>
              <Ionicons name="play-forward" size={16} color="#475569" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekLabelsRow}>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, idx) => (
              <Text key={idx} style={[styles.weekLabel, label === 'CN' && styles.weekLabelSunday]}>{label}</Text>
            ))}
          </View>

          <View style={styles.gridContainer}>
            {grid}
          </View>

          <View style={styles.pickerFooter}>
            <TouchableOpacity onPress={onClose} style={styles.pickerCloseBtn}>
              <Text style={styles.pickerCloseBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SystemViolations = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid', 'paid', 'all'
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [minFine, setMinFine] = useState('');
  const [maxFine, setMaxFine] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState(''); // 'dateFrom' or 'dateTo'
  
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
      let url = `/violations?page=${pageNum}&limit=10${statusParam}${queryParam}`;
      
      if (minFine.trim()) {
        url += `&min_fine=${encodeURIComponent(minFine.trim())}`;
      }
      if (maxFine.trim()) {
        url += `&max_fine=${encodeURIComponent(maxFine.trim())}`;
      }
      if (dateFrom.trim()) {
        url += `&date_from=${encodeURIComponent(dateFrom.trim())}`;
      }
      if (dateTo.trim()) {
        url += `&date_to=${encodeURIComponent(dateTo.trim())}`;
      }

      const response = await axiosClient.get(url);
      
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
              <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm loại vi phạm, mô tả, S/N, mẫu, tên..."
                placeholderTextColor="#94A3B8"
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
            <TouchableOpacity 
              style={[styles.filterToggleBtn, (minFine || maxFine || dateFrom || dateTo || showFilters) && styles.filterToggleBtnActive]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons 
                name={showFilters ? "funnel" : "funnel-outline"} 
                size={20} 
                color={minFine || maxFine || dateFrom || dateTo || showFilters ? "#FFFFFF" : "#64748B"} 
              />
            </TouchableOpacity>
          </View>

          {/* ADVANCED FILTER PANEL */}
          {showFilters && (
            <View style={styles.advancedFiltersPanel}>
              <Text style={styles.filterGroupTitle}>Bộ lọc nâng cao</Text>

              {/* Date range filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Ngày ghi nhận (Năm-Tháng-Ngày)</Text>
                <View style={styles.dateInputsRow}>
                  <TouchableOpacity
                    style={styles.dateInputBtn}
                    onPress={() => {
                      setDatePickerTarget('dateFrom');
                      setDatePickerVisible(true);
                    }}
                  >
                    <Text style={[styles.dateInputBtnText, !dateFrom && styles.datePlaceholderText]}>
                      {dateFrom || 'Từ ngày'}
                    </Text>
                    {dateFrom ? (
                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          setDateFrom('');
                        }}
                        style={styles.clearDateIcon}
                      >
                        <Ionicons name="close-circle" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name="calendar-outline" size={16} color="#64748B" />
                    )}
                  </TouchableOpacity>

                  <Text style={styles.dateRangeSeparator}>đến</Text>

                  <TouchableOpacity
                    style={styles.dateInputBtn}
                    onPress={() => {
                      setDatePickerTarget('dateTo');
                      setDatePickerVisible(true);
                    }}
                  >
                    <Text style={[styles.dateInputBtnText, !dateTo && styles.datePlaceholderText]}>
                      {dateTo || 'Đến ngày'}
                    </Text>
                    {dateTo ? (
                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          setDateTo('');
                        }}
                        style={styles.clearDateIcon}
                      >
                        <Ionicons name="close-circle" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name="calendar-outline" size={16} color="#64748B" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Fine range filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Mức phạt tiền (VNĐ)</Text>
                <View style={styles.dateInputsRow}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="Tối thiểu (vd: 100000)"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={minFine}
                    onChangeText={setMinFine}
                  />
                  <Text style={styles.dateRangeSeparator}>đến</Text>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="Tối đa (vd: 5000000)"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={maxFine}
                    onChangeText={setMaxFine}
                  />
                </View>
              </View>

              {/* Filter Actions */}
              <View style={styles.filterActionsRow}>
                <TouchableOpacity 
                  style={styles.resetFilterBtn} 
                  onPress={() => {
                    setMinFine('');
                    setMaxFine('');
                    setDateFrom('');
                    setDateTo('');
                    setShowFilters(false);
                    setTimeout(() => {
                      fetchViolations(1);
                    }, 50);
                  }}
                >
                  <Text style={styles.resetFilterBtnText}>Thiết lập lại</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.applyFilterBtn}
                  onPress={() => {
                    setShowFilters(false);
                    fetchViolations(1);
                  }}
                >
                  <Text style={styles.applyFilterBtnText}>Áp dụng bộ lọc</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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

          {/* Custom Date Picker Modal */}
          <CustomDatePickerModal
            visible={datePickerVisible}
            onClose={() => setDatePickerVisible(false)}
            value={datePickerTarget === 'dateFrom' ? dateFrom : dateTo}
            onSelect={(dateStr) => {
              if (datePickerTarget === 'dateFrom') {
                setDateFrom(dateStr);
              } else {
                setDateTo(dateStr);
              }
              setDatePickerVisible(false);
            }}
          />
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
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  filterToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleBtnActive: {
    backgroundColor: '#0080FF',
  },
  
  // Advanced filters panel
  advancedFiltersPanel: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  filterGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 14,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  dateInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInputBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInputBtnText: {
    fontSize: 12,
    color: '#0F172A',
  },
  datePlaceholderText: {
    color: '#94A3B8',
  },
  clearDateIcon: {
    padding: 2,
  },
  
  // Custom Date Picker Modal styling
  pickerContainer: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  navBtn: {
    padding: 6,
  },
  pickerMonthTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  weekLabelsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
    marginBottom: 8,
  },
  weekLabel: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  weekLabelSunday: {
    color: '#EF4444',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  gridCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  gridCellActive: {
    backgroundColor: '#0080FF',
  },
  gridCellEmpty: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
  },
  gridCellText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  gridCellTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pickerFooter: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  pickerCloseBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  pickerCloseBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  dateRangeSeparator: {
    fontSize: 12,
    color: '#64748B',
  },
  filterActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  resetFilterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  resetFilterBtnText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  applyFilterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0080FF',
  },
  applyFilterBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
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
