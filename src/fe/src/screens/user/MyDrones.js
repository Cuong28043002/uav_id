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
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

const { width } = Dimensions.get('window');

const MyDrones = ({ navigation }) => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [qrCodes, setQrCodes] = useState({});
  const [qrLoading, setQrLoading] = useState({});

  // Filter & Pagination states
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMfr, setSelectedMfr] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWeight, setSelectedWeight] = useState('all');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const [mRes, cRes] = await Promise.all([
        axiosClient.get('/manufacturers'),
        axiosClient.get('/drone-categories'),
      ]);
      setManufacturers(mRes.data?.data || []);
      setCategories(cRes.data?.data || []);
    } catch (e) {
      console.log('Error fetching filters:', e);
    }
  };

  const fetchDrones = async (pageNum = 1, isRefresh = false) => {
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
      let url = `/drones?page=${pageNum}&limit=10&q=${encodeURIComponent(search)}`;
      if (selectedMfr !== 'all') {
        url += `&manufacturer_id=${selectedMfr}`;
      }
      if (selectedCat !== 'all') {
        url += `&category_id=${selectedCat}`;
      }
      
      // Handle weight filter on server-side
      if (selectedWeight === 'light') {
        url += `&max_weight=0.250`;
      } else if (selectedWeight === 'medium') {
        url += `&min_weight=0.250&max_weight=25`;
      } else if (selectedWeight === 'heavy') {
        url += `&min_weight=25`;
      }

      const response = await axiosClient.get(url);
      const newData = response.data?.data || [];
      const meta = response.data?.meta;

      if (pageNum === 1) {
        setDrones(newData);
      } else {
        setDrones((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          const filtered = newData.filter((d) => !existingIds.has(d.id));
          return [...prev, ...filtered];
        });
      }

      if (meta) {
        setHasMore(pageNum < meta.totalPages);
      } else {
        setHasMore(newData.length >= 10);
      }
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách thiết bị UAV.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDrones(1, false);
  }, [search, selectedMfr, selectedCat, selectedWeight]);

  const handleRefresh = () => {
    fetchDrones(1, true);
  };

  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    fetchDrones(page + 1, false);
  };

  const handleResetFilters = () => {
    setSelectedMfr('all');
    setSelectedCat('all');
    setSelectedStatus('all');
    setSelectedWeight('all');
  };

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

  const getActiveReg = (regs) => {
    if (!regs || regs.length === 0) return null;
    const approved = regs.find((r) => r.status === 'approved');
    if (approved) return approved;
    const pending = regs.find((r) => r.status === 'pending');
    if (pending) return pending;
    const sorted = [...regs].sort((a, b) => b.id - a.id);
    return sorted[0];
  };

  const getFilteredDrones = () => {
    if (selectedStatus === 'all') return drones;
    return drones.filter((item) => {
      const reg = getActiveReg(item.registrations);
      const status = reg?.status || 'none';
      if (selectedStatus === 'approved') return status === 'approved';
      if (selectedStatus === 'pending') return status === 'pending';
      if (selectedStatus === 'none') return status === 'none' || status === 'rejected' || status === 'revoked';
      return true;
    });
  };

  const renderDroneItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const reg = getActiveReg(item.registrations);
    const qrBase64 = qrCodes[item.id];
    const isQrLoading = qrLoading[item.id];

    const getStatusText = (status) => {
      if (status === 'approved') return 'ĐÃ ĐỊNH DANH';
      if (status === 'pending') return 'ĐANG DUYỆT';
      if (status === 'revoked') return 'BỊ THU HỒI';
      if (status === 'rejected') return 'BỊ TỪ CHỐI';
      return 'CHƯA ĐĂNG KÝ';
    };

    const getStatusStyles = (status) => {
      if (status === 'approved') return { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle' };
      if (status === 'pending') return { bg: '#FFF3E0', text: '#EF6C00', icon: 'time' };
      if (status === 'revoked') return { bg: '#FFEBEE', text: '#C62828', icon: 'alert-circle' };
      if (status === 'rejected') return { bg: '#F5F5F5', text: '#616161', icon: 'close-circle' };
      return { bg: '#ECEFF1', text: '#455A64', icon: 'help-circle' };
    };

    const statusInfo = getStatusStyles(reg?.status);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleExpand(item.id, reg?.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardIconBg}>
            <Ionicons name="airplane" size={20} color="#0080FF" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.modelName}>{item.model_name}</Text>
            <Text style={styles.serialNumber}>S/N: {item.serial_number}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
              <Ionicons name={statusInfo.icon} size={11} color={statusInfo.text} style={{ marginRight: 4 }} />
              <Text style={[styles.badgeText, { color: statusInfo.text }]}>
                {getStatusText(reg?.status)}
              </Text>
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#94A3B8"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.detailsContainer}>
            <View style={styles.divider} />
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="business" size={16} color="#64748B" />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>Nhà sản xuất</Text>
                  <Text style={styles.infoValue}>{item.manufacturer?.name || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="options" size={16} color="#64748B" />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>Phân loại UAV</Text>
                  <Text style={styles.infoValue}>{item.category?.name || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="barbell" size={16} color="#64748B" />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>Trọng lượng</Text>
                  <Text style={styles.infoValue}>{item.weight ? `${item.weight} kg` : 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="trending-up" size={16} color="#64748B" />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>Trọng trần bay</Text>
                  <Text style={styles.infoValue}>{item.max_flight_height ? `${item.max_flight_height} m` : 'N/A'}</Text>
                </View>
              </View>
            </View>

            {reg?.status === 'approved' && (
              <View style={styles.qrContainer}>
                <View style={styles.qrHeaderRow}>
                  <Ionicons name="qr-code" size={14} color="#0080FF" />
                  <Text style={styles.qrTitle}>MÃ ĐỊNH DANH HỢP LỆ</Text>
                </View>
                <Text style={styles.qrCodeText}>{reg.identification_code}</Text>
                {isQrLoading ? (
                  <ActivityIndicator size="small" color="#0080FF" style={{ margin: 16 }} />
                ) : qrBase64 ? (
                  <View style={styles.qrWrapper}>
                    <Image source={{ uri: qrBase64 }} style={styles.qrImage} />
                  </View>
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
              <LinearGradient
                colors={['#0080FF', '#0059B2']}
                style={styles.detailBtnGradient}
              >
                <Ionicons name="information-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.detailBtnText}>Xem chi tiết & lịch sử bay</Text>
              </LinearGradient>
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
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>UAV Của Tôi</Text>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm theo model, số serial..."
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.filterToggleBtn, showFilters && styles.filterToggleBtnActive]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons
                name="filter"
                size={20}
                color={showFilters ? '#FFFFFF' : '#64748B'}
              />
            </TouchableOpacity>
          </View>

          {showFilters && (
            <View style={styles.advancedFiltersPanel}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Trạng thái định danh</Text>
                <View style={styles.selectorRow}>
                  {['all', 'approved', 'pending', 'none'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.selectorBtn,
                        selectedStatus === status && styles.selectorBtnActive,
                      ]}
                      onPress={() => setSelectedStatus(status)}
                    >
                      <Text
                        style={[
                          styles.selectorBtnText,
                          selectedStatus === status && styles.selectorBtnTextActive,
                        ]}
                      >
                        {status === 'all'
                          ? 'Tất cả'
                          : status === 'approved'
                          ? 'Đã định danh'
                          : status === 'pending'
                          ? 'Đang duyệt'
                          : 'Chưa đăng ký'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Phân loại Trọng lượng</Text>
                <View style={styles.selectorRow}>
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'light', label: '< 250g' },
                    { id: 'medium', label: '250g - 25kg' },
                    { id: 'heavy', label: '> 25kg' },
                  ].map((w) => (
                    <TouchableOpacity
                      key={w.id}
                      style={[
                        styles.selectorBtn,
                        selectedWeight === w.id && styles.selectorBtnActive,
                      ]}
                      onPress={() => setSelectedWeight(w.id)}
                    >
                      <Text
                        style={[
                          styles.selectorBtnText,
                          selectedWeight === w.id && styles.selectorBtnTextActive,
                        ]}
                      >
                        {w.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {manufacturers.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Nhà sản xuất</Text>
                  <View style={styles.selectorRow}>
                    <TouchableOpacity
                      style={[
                        styles.selectorBtn,
                        selectedMfr === 'all' && styles.selectorBtnActive,
                      ]}
                      onPress={() => setSelectedMfr('all')}
                    >
                      <Text style={[styles.selectorBtnText, selectedMfr === 'all' && styles.selectorBtnTextActive]}>
                        Tất cả
                      </Text>
                    </TouchableOpacity>
                    {manufacturers.map((mfr) => (
                      <TouchableOpacity
                        key={mfr.id}
                        style={[
                          styles.selectorBtn,
                          selectedMfr === String(mfr.id) && styles.selectorBtnActive,
                        ]}
                        onPress={() => setSelectedMfr(String(mfr.id))}
                      >
                        <Text style={[styles.selectorBtnText, selectedMfr === String(mfr.id) && styles.selectorBtnTextActive]}>
                          {mfr.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {categories.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Danh mục UAV</Text>
                  <View style={styles.selectorRow}>
                    <TouchableOpacity
                      style={[
                        styles.selectorBtn,
                        selectedCat === 'all' && styles.selectorBtnActive,
                      ]}
                      onPress={() => setSelectedCat('all')}
                    >
                      <Text style={[styles.selectorBtnText, selectedCat === 'all' && styles.selectorBtnTextActive]}>
                        Tất cả
                      </Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.selectorBtn,
                          selectedCat === String(cat.id) && styles.selectorBtnActive,
                        ]}
                        onPress={() => setSelectedCat(String(cat.id))}
                      >
                        <Text style={[styles.selectorBtnText, selectedCat === String(cat.id) && styles.selectorBtnTextActive]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {(selectedMfr !== 'all' || selectedCat !== 'all' || selectedStatus !== 'all' || selectedWeight !== 'all') && (
                <View style={styles.filterActionsRow}>
                  <TouchableOpacity
                    style={styles.resetFilterBtn}
                    onPress={handleResetFilters}
                  >
                    <Text style={styles.resetFilterBtnText}>Xóa tất cả bộ lọc</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {loading && !refreshing ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0080FF" />
            </View>
          ) : (
            <FlatList
              data={getFilteredDrones()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderDroneItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
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
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  modelName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  serialNumber: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    columnGap: 16,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  infoItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  infoValue: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 1,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  qrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qrTitle: {
    color: '#0080FF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  qrCodeText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 12,
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrImage: {
    width: 140,
    height: 140,
  },
  qrErrorText: {
    color: '#EF4444',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 120,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
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
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  detailBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  detailBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
  },
  clearButton: {
    padding: 2,
  },
  filterToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterToggleBtnActive: {
    backgroundColor: '#0080FF',
    borderColor: '#0080FF',
  },
  advancedFiltersPanel: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectorBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  selectorBtnActive: {
    backgroundColor: '#0080FF',
  },
  selectorBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  selectorBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  resetFilterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  resetFilterBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  footerLoader: {
    marginVertical: 12,
    alignItems: 'center',
  },
});

export default MyDrones;
