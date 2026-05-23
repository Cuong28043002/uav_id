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
import DateTimePickerModal from '../../components/DateTimePickerModal';
import Alert from '../../components/CustomAlert';

const FlightLogs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDroneId, setFilterDroneId] = useState(null);

  // Form Metadata
  const [drones, setDrones] = useState([]);
  const [permits, setPermits] = useState([]);

  // Form Fields
  const [selectedDroneId, setSelectedDroneId] = useState(null);
  const [selectedPermitId, setSelectedPermitId] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxAltitude, setMaxAltitude] = useState('');
  const [distance, setDistance] = useState('');

  const [saveLoading, setSaveLoading] = useState(false);

  // Date picker states
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState('start');

  // Load drones once on mount (to use for filtering and form)
  useEffect(() => {
    const loadInitMetadata = async () => {
      try {
        const dronesRes = await axiosClient.get('/drones');
        setDrones(dronesRes.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    loadInitMetadata();
  }, []);

  const fetchLogs = async (pageNum, isRefresh = false) => {
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
        page: pageNum,
        limit: 10,
      };
      if (filterDroneId) {
        params.drone_id = filterDroneId;
      }

      const response = await axiosClient.get('/flight/logs', { params });
      const newLogs = response.data?.data || [];

      if (pageNum === 1) {
        setLogs(newLogs);
      } else {
        setLogs((prev) => {
          const merged = [...prev];
          newLogs.forEach((item) => {
            if (!merged.some((existing) => existing.id === item.id)) {
              merged.push(item);
            }
          });
          return merged;
        });
      }

      setHasMore(newLogs.length === 10);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải nhật ký bay.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'list') {
      setPage(1);
      fetchLogs(1);
    } else {
      // Load approved permits for recording
      const fetchPermits = async () => {
        try {
          const res = await axiosClient.get('/flight/permits?status=approved');
          setPermits(res.data?.data || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchPermits();
    }
  }, [activeTab, filterDroneId]);

  const handleRefresh = () => {
    setPage(1);
    fetchLogs(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLogs(nextPage);
    }
  };

  const handleSelectDrone = (id) => {
    setSelectedDroneId(id);
    // Reset selected permit if it doesn't belong to the selected drone
    const permit = permits.find((p) => p.id === selectedPermitId);
    if (permit && permit.drone_id !== id) {
      setSelectedPermitId(null);
    }
  };

  const handleSelectPermit = (id) => {
    setSelectedPermitId(id);
    const permit = permits.find((p) => p.id === id);
    if (permit) {
      setSelectedDroneId(permit.drone_id);
    }
  };

  const handleSaveLog = async () => {
    if (!selectedDroneId) {
      Alert.alert('Thông báo', 'Vui lòng chọn thiết bị UAV.');
      return;
    }
    if (!startTime) {
      Alert.alert('Thông báo', 'Vui lòng chọn thời gian bắt đầu bay.');
      return;
    }

    setSaveLoading(true);
    try {
      const response = await axiosClient.post('/flight/logs', {
        drone_id: parseInt(selectedDroneId),
        permit_id: selectedPermitId ? parseInt(selectedPermitId) : null,
        start_time: startTime,
        end_time: endTime || null,
        max_altitude: maxAltitude ? parseFloat(maxAltitude) : null,
        distance: distance ? parseFloat(distance) : null,
      });

      if (response.data?.success) {
        Alert.alert('Thành công', 'Đã ghi nhận nhật ký chuyến bay!', [
          {
            text: 'OK',
            onPress: () => {
              setActiveTab('list');
              setPage(1);
              fetchLogs(1);
            },
          },
        ]);
        // Reset form
        setSelectedDroneId(null);
        setSelectedPermitId(null);
        setStartTime('');
        setEndTime('');
        setMaxAltitude('');
        setDistance('');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể tạo nhật ký bay.');
    } finally {
      setSaveLoading(false);
    }
  };

  const formatDisplayDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    const diffMs = new Date(end) - new Date(start);
    if (diffMs <= 0) return '';
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) {
      return `${diffMins} phút`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours} giờ ${mins} phút`;
  };

  // Client-side filtering by search query
  const filteredLogs = logs.filter((item) => {
    const model = (item.drone?.model_name || '').toLowerCase();
    const serial = (item.drone?.serial_number || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return model.includes(query) || serial.includes(query);
  });

  const availablePermits = permits.filter(
    (p) => !selectedDroneId || p.drone_id === selectedDroneId
  );

  const renderLogItem = ({ item }) => {
    const durationStr = calculateDuration(item.start_time, item.end_time);
    const isOngoing = !item.end_time;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleCol}>
            <Text style={styles.modelName}>{item.drone?.model_name || 'Thiết bị chưa rõ'}</Text>
            <Text style={styles.serialText}>S/N: {item.drone?.serial_number}</Text>
          </View>
          <View style={[styles.statusBadge, isOngoing ? styles.statusBadgeActive : styles.statusBadgeCompleted]}>
            <Ionicons
              name={isOngoing ? "flash-outline" : "checkmark-done-circle-outline"}
              size={12}
              color={isOngoing ? "#10B981" : "#475569"}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.statusBadgeText, isOngoing ? styles.statusBadgeTextActive : styles.statusBadgeTextCompleted]}>
              {isOngoing ? "Đang bay" : "Đã hoàn thành"}
            </Text>
          </View>
        </View>

        {item.permit && (
          <View style={styles.permitInfoRow}>
            <Ionicons name="document-text-outline" size={13} color="#0080FF" />
            <Text style={styles.permitInfoText}>
              Giấy phép GP-{item.permit.id} ({item.permit.purpose})
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.timeSection}>
          <View style={styles.timePoint}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={styles.timeValueText}>{formatDisplayDateTime(item.start_time)}</Text>
          </View>
          <Ionicons name="arrow-forward-outline" size={14} color="#94A3B8" />
          <View style={styles.timePoint}>
            <Ionicons name="flag-outline" size={14} color="#64748B" />
            <Text style={styles.timeValueText}>
              {item.end_time ? formatDisplayDateTime(item.end_time) : 'Đang diễn ra...'}
            </Text>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <Ionicons name="trending-up-outline" size={15} color="#94A3B8" />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Độ cao tối đa</Text>
              <Text style={styles.statVal}>{item.max_altitude ? `${item.max_altitude} m` : 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.statCell}>
            <Ionicons name="resize-outline" size={15} color="#94A3B8" />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Quãng đường</Text>
              <Text style={styles.statVal}>{item.distance ? `${item.distance} km` : 'N/A'}</Text>
            </View>
          </View>

          {durationStr ? (
            <View style={styles.statCell}>
              <Ionicons name="hourglass-outline" size={15} color="#94A3B8" />
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Thời lượng</Text>
                <Text style={styles.statVal}>{durationStr}</Text>
              </View>
            </View>
          ) : null}
        </View>
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
            <Text style={styles.headerTitle}>Nhật Ký Chuyến Bay</Text>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'list' && styles.activeTabItem]}
              onPress={() => setActiveTab('list')}
            >
              <Ionicons
                name="list-circle-outline"
                size={18}
                color={activeTab === 'list' ? '#0080FF' : '#64748B'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
                Lịch sử bay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'add' && styles.activeTabItem]}
              onPress={() => setActiveTab('add')}
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color={activeTab === 'add' ? '#0080FF' : '#64748B'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
                Ghi nhận chuyến mới
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'list' ? (
            <View style={{ flex: 1 }}>
              {/* Search & Filter Bar */}
              <View style={styles.searchFilterWrapper}>
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm theo Model hoặc Serial Number..."
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

              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0080FF" />
                </View>
              ) : (
                <FlatList
                  data={filteredLogs}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderLogItem}
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
                      <Ionicons name="paper-plane-outline" size={48} color="#94A3B8" />
                      <Text style={styles.emptyText}>Chưa có lịch sử chuyến bay nào được ghi nhận</Text>
                    </View>
                  }
                />
              )}
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              {/* Form Intro Banner */}
              <View style={styles.introCard}>
                <View style={styles.introIconBg}>
                  <Ionicons name="journal-outline" size={22} color="#0080FF" />
                </View>
                <View style={styles.introTextCol}>
                  <Text style={styles.introTitle}>Ghi nhận nhật ký bay</Text>
                  <Text style={styles.introDesc}>
                    Cung cấp các thông số thực tế của chuyến bay để lưu trữ lịch sử hoạt động và chứng thực vi phạm (nếu có).
                  </Text>
                </View>
              </View>

              <View style={styles.formCard}>
                {/* Section 1: Thiết bị & Giấy phép */}
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="airplane-outline" size={16} color="#0080FF" />
                  <Text style={styles.sectionTitle}>Thiết bị & Giấy phép</Text>
                </View>

                <Text style={styles.inputLabel}>Chọn thiết bị UAV bay *</Text>
                {drones.length === 0 ? (
                  <Text style={styles.noDronesText}>Bạn chưa có UAV nào trong hệ thống.</Text>
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
                          selectedDroneId === item.id && styles.chipItemActive,
                        ]}
                        onPress={() => handleSelectDrone(item.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="airplane"
                          size={14}
                          color={selectedDroneId === item.id ? '#0080FF' : '#64748B'}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.chipItemText,
                            selectedDroneId === item.id && styles.chipItemTextActive,
                          ]}
                        >
                          {item.model_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                <Text style={styles.inputLabel}>Chọn Giấy phép bay chuyến áp dụng (Nếu có)</Text>
                {availablePermits.length === 0 ? (
                  <Text style={styles.infoHintText}>
                    Không tìm thấy giấy phép đã duyệt áp dụng cho thiết bị này.
                  </Text>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={{ paddingVertical: 4 }}
                  >
                    {availablePermits.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.chipItem,
                          selectedPermitId === item.id && styles.chipItemActive,
                        ]}
                        onPress={() => handleSelectPermit(item.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={14}
                          color={selectedPermitId === item.id ? '#0080FF' : '#64748B'}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.chipItemText,
                            selectedPermitId === item.id && styles.chipItemTextActive,
                          ]}
                        >
                          GP-{item.id} ({item.purpose})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {/* Section 2: Thời gian hoạt động */}
                <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
                  <Ionicons name="calendar-outline" size={16} color="#0080FF" />
                  <Text style={styles.sectionTitle}>Lịch trình thực tế</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Thời gian cất cánh *</Text>
                  <TouchableOpacity
                    style={styles.dateTimeSelector}
                    onPress={() => {
                      setPickerTarget('start');
                      setPickerVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dateTimeText, !startTime && styles.placeholderText]}>
                      {startTime ? formatDisplayDateTime(startTime) : 'Chọn thời điểm cất cánh'}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#0080FF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Thời gian hạ cánh</Text>
                  <TouchableOpacity
                    style={styles.dateTimeSelector}
                    onPress={() => {
                      setPickerTarget('end');
                      setPickerVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dateTimeText, !endTime && styles.placeholderText]}>
                      {endTime ? formatDisplayDateTime(endTime) : 'Chọn thời điểm hạ cánh (để trống nếu đang bay)'}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#0080FF" />
                  </TouchableOpacity>
                </View>

                {/* Section 3: Chỉ số đo đạc */}
                <View style={[styles.sectionHeaderRow, { marginTop: 12 }]}>
                  <Ionicons name="speedometer-outline" size={16} color="#0080FF" />
                  <Text style={styles.sectionTitle}>Các thông số đo lường</Text>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Độ cao tối đa (m)</Text>
                    <View style={styles.inputFieldContainer}>
                      <Ionicons name="trending-up-outline" size={18} color="#94A3B8" style={styles.inputFieldIcon} />
                      <TextInput
                        style={styles.inputField}
                        placeholder="Ví dụ: 100"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={maxAltitude}
                        onChangeText={setMaxAltitude}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputWrapper, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Quãng đường (km)</Text>
                    <View style={styles.inputFieldContainer}>
                      <Ionicons name="resize-outline" size={18} color="#94A3B8" style={styles.inputFieldIcon} />
                      <TextInput
                        style={styles.inputField}
                        placeholder="Ví dụ: 2.5"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={distance}
                        onChangeText={setDistance}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSaveLog}
                  disabled={saveLoading}
                  activeOpacity={0.8}
                >
                  {saveLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <LinearGradient
                      colors={['#0080FF', '#0059B2']}
                      style={styles.submitBtnGradient}
                    >
                      <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.submitBtnText}>GHI NHẬN CHUYẾN BAY</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          <DateTimePickerModal
            visible={pickerVisible}
            onClose={() => setPickerVisible(false)}
            title={pickerTarget === 'start' ? "Thời điểm cất cánh" : "Thời điểm hạ cánh"}
            onConfirm={(formattedDate) => {
              if (pickerTarget === 'start') {
                setStartTime(formattedDate);
              } else {
                setEndTime(formattedDate);
              }
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
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
    marginTop: 60,
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
    alignItems: 'flex-start',
  },
  cardTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  modelName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  serialText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeCompleted: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBadgeTextActive: {
    color: '#065F46',
  },
  statusBadgeTextCompleted: {
    color: '#475569',
  },
  permitInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  permitInfoText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  timePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeValueText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  statCol: {},
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  statVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 12,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
  },
  scrollContent: {
    padding: 16,
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
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noDronesText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 16,
  },
  infoHintText: {
    color: '#64748B',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 16,
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
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  dateTimeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 16,
  },
  dateTimeText: {
    color: '#0F172A',
    fontSize: 14,
  },
  placeholderText: {
    color: '#94A3B8',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
  },
  inputFieldIcon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
  },
  submitBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 12,
    height: 50,
  },
  submitBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default FlightLogs;
