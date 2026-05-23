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
  Alert,
  ImageBackground,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

const { width, height } = Dimensions.get('window');

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

const ManageUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState('dateFrom');

  // User Detail State
  const [selectedUser, setSelectedUser] = useState(null);

  // Lazy load states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchUsers = async (pageNum = 1, isRefresh = false) => {
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
      let url = `/users?page=${pageNum}&limit=10&q=${encodeURIComponent(search)}`;
      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }
      if (filterRole !== 'all') {
        url += `&role_id=${filterRole}`;
      }
      if (dateFrom) {
        url += `&created_from=${dateFrom}`;
      }
      if (dateTo) {
        url += `&created_to=${dateTo}`;
      }

      const response = await axiosClient.get(url);
      const newData = response.data?.data || [];
      const meta = response.data?.meta;

      if (pageNum === 1) {
        setUsers(newData);
      } else {
        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const filteredNew = newData.filter((u) => !existingIds.has(u.id));
          return [...prev, ...filteredNew];
        });
      }

      if (meta) {
        setHasMore(pageNum < meta.totalPages);
      } else {
        setHasMore(newData.length >= 10);
      }
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy danh sách người dùng.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, false);
  }, [search, filterStatus, filterRole, dateFrom, dateTo]);

  const handleResetFilters = () => {
    setFilterStatus('all');
    setFilterRole('all');
    setDateFrom('');
    setDateTo('');
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'banned' : 'active';
    const actionText = nextStatus === 'banned' ? 'khóa' : 'mở khóa';

    Alert.alert(
      'Xác nhận',
      `Bạn có chắc chắn muốn ${actionText} tài khoản của ${user.full_name}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          style: nextStatus === 'banned' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              const response = await axiosClient.patch(`/users/${user.id}/status`, {
                status: nextStatus,
              });
              if (response.data?.success) {
                setUsers((prev) =>
                  prev.map((item) =>
                    item.id === user.id ? { ...item, status: nextStatus } : item
                  )
                );
              }
            } catch (error) {
              Alert.alert('Thất bại', `Không thể ${actionText} tài khoản.`);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    fetchUsers(1, true);
  };

  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    fetchUsers(page + 1, false);
  };

  const renderUserItem = ({ item }) => {
    const getRoleName = (item) => {
      if (item.role?.name) return item.role.name.toUpperCase();
      if (item.role_id === 1) return 'ADMIN';
      if (item.role_id === 2) return 'POLICE';
      return 'USER';
    };

    const isBanned = item.status !== 'active';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => setSelectedUser(item)}
      >
        <View style={styles.cardInfo}>
          <Text style={styles.userName}>{item.full_name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.roleBadge]}>
              <Text style={styles.badgeText}>{getRoleName(item)}</Text>
            </View>
            <View
              style={[
                styles.badge,
                !isBanned ? styles.activeBadge : styles.bannedBadge,
              ]}
            >
              <Text style={[styles.badgeText, !isBanned ? styles.activeBadgeText : styles.bannedBadgeText]}>
                {!isBanned ? 'ĐANG HOẠT ĐỘNG' : 'BỊ KHÓA'}
              </Text>
            </View>
          </View>
        </View>

        {item.email !== 'admin@uavid.vn' && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              !isBanned ? styles.banButton : styles.activeButton,
            ]}
            onPress={() => handleToggleStatus(item)}
          >
            <Ionicons
              name={!isBanned ? 'lock-open-outline' : 'lock-closed-outline'}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const UserDetailModal = () => {
    if (!selectedUser) return null;

    const getRoleName = (item) => {
      if (item.role?.name) return item.role.name.toUpperCase();
      if (item.role_id === 1) return 'ADMIN';
      if (item.role_id === 2) return 'POLICE';
      return 'USER';
    };

    const isBanned = selectedUser.status !== 'active';

    return (
      <Modal
        visible={selectedUser !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedUser(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailHeaderTitle}>Chi Tiết Tài Khoản</Text>
              <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailBody} showsVerticalScrollIndicator={false}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBg}>
                  <Ionicons name="person" size={48} color="#0080FF" />
                </View>
                <Text style={styles.detailName}>{selectedUser.full_name}</Text>
                <View style={styles.badgeContainerDetail}>
                  <View style={[styles.badge, styles.roleBadge]}>
                    <Text style={styles.badgeText}>{getRoleName(selectedUser)}</Text>
                  </View>
                  <View style={[styles.badge, !isBanned ? styles.activeBadge : styles.bannedBadge]}>
                    <Text style={[styles.badgeText, !isBanned ? styles.activeBadgeText : styles.bannedBadgeText]}>
                      {!isBanned ? 'ĐANG HOẠT ĐỘNG' : 'BỊ KHÓA'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Địa chỉ Email</Text>
                    <Text style={styles.infoValue}>{selectedUser.email}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color="#64748B" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Số điện thoại</Text>
                    <Text style={styles.infoValue}>{selectedUser.phone || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="card-outline" size={20} color="#64748B" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Số CCCD/Passport</Text>
                    <Text style={styles.infoValue}>{selectedUser.cccd_number || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={20} color="#64748B" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Địa chỉ thường trú</Text>
                    <Text style={styles.infoValue}>{selectedUser.address || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={20} color="#64748B" style={styles.infoIcon} />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Ngày đăng ký hệ thống</Text>
                    <Text style={styles.infoValue}>
                      {selectedUser.createdAt
                        ? formatDateDisplay(selectedUser.createdAt.substring(0, 10)) + ' ' + selectedUser.createdAt.substring(11, 19)
                        : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.detailFooter}>
              {selectedUser.email !== 'admin@uavid.vn' && (
                <TouchableOpacity
                  style={[
                    styles.footerActionBtn,
                    !isBanned ? styles.banBtn : styles.unbanBtn,
                  ]}
                  onPress={() => {
                    handleToggleStatus(selectedUser);
                    setSelectedUser((prev) => ({
                      ...prev,
                      status: isBanned ? 'active' : 'banned',
                    }));
                  }}
                >
                  <Ionicons
                    name={!isBanned ? 'lock-closed-outline' : 'lock-open-outline'}
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.footerActionBtnText}>
                    {!isBanned ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.footerActionBtn, styles.closeActionBtn]}
                onPress={() => setSelectedUser(null)}
              >
                <Text style={styles.footerCloseBtnText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
            <Text style={styles.headerTitle}>Quản Lý Tài Khoản</Text>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm theo tên, email, SĐT..."
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
                <Text style={styles.filterLabel}>Trạng thái tài khoản</Text>
                <View style={styles.selectorRow}>
                  {['all', 'active', 'banned'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.selectorBtn,
                        filterStatus === status && styles.selectorBtnActive,
                      ]}
                      onPress={() => setFilterStatus(status)}
                    >
                      <Text
                        style={[
                          styles.selectorBtnText,
                          filterStatus === status && styles.selectorBtnTextActive,
                        ]}
                      >
                        {status === 'all'
                          ? 'Tất cả'
                          : status === 'active'
                          ? 'Đang hoạt động'
                          : 'Bị khóa'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Vai trò tài khoản</Text>
                <View style={styles.selectorRow}>
                  {['all', '1', '2', '3'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.selectorBtn,
                        filterRole === role && styles.selectorBtnActive,
                      ]}
                      onPress={() => setFilterRole(role)}
                    >
                      <Text
                        style={[
                          styles.selectorBtnText,
                          filterRole === role && styles.selectorBtnTextActive,
                        ]}
                      >
                        {role === 'all'
                          ? 'Tất cả'
                          : role === '1'
                          ? 'Admin'
                          : role === '2'
                          ? 'Police'
                          : 'User'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Ngày đăng ký (Khoảng thời gian)</Text>
                <View style={styles.dateInputsRow}>
                  <TouchableOpacity
                    style={styles.dateInputBtn}
                    onPress={() => {
                      setDatePickerTarget('dateFrom');
                      setDatePickerVisible(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.dateInputBtnText,
                        !dateFrom && styles.datePlaceholderText,
                      ]}
                    >
                      {dateFrom ? formatDateDisplay(dateFrom) : 'Từ ngày'}
                    </Text>
                    {dateFrom ? (
                      <TouchableOpacity
                        onPress={() => setDateFrom('')}
                        style={styles.clearDateIcon}
                      >
                        <Ionicons name="close-circle" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
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
                    <Text
                      style={[
                        styles.dateInputBtnText,
                        !dateTo && styles.datePlaceholderText,
                      ]}
                    >
                      {dateTo ? formatDateDisplay(dateTo) : 'Đến ngày'}
                    </Text>
                    {dateTo ? (
                      <TouchableOpacity
                        onPress={() => setDateTo('')}
                        style={styles.clearDateIcon}
                      >
                        <Ionicons name="close-circle" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {(filterStatus !== 'all' || filterRole !== 'all' || dateFrom || dateTo) && (
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
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderUserItem}
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
                  <Text style={styles.emptyText}>Không tìm thấy tài khoản nào</Text>
                </View>
              }
            />
          )}

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

          <UserDetailModal />
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
  },
  loaderContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  userName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  roleBadge: {
    backgroundColor: '#F1F5F9',
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  activeBadgeText: {
    color: '#065F46',
  },
  bannedBadge: {
    backgroundColor: '#FEE2E2',
  },
  bannedBadgeText: {
    color: '#991B1B',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banButton: {
    backgroundColor: '#EF4444',
  },
  activeButton: {
    backgroundColor: '#10B981',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearButton: {
    padding: 4,
  },
  filterToggleBtn: {
    width: 48,
    height: 48,
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
    marginHorizontal: 20,
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
    marginBottom: 14,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  selectorBtnActive: {
    backgroundColor: '#0080FF',
  },
  selectorBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  selectorBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  dateRangeSeparator: {
    fontSize: 12,
    color: '#64748B',
  },
  filterActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  resetFilterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  resetFilterBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  detailContainer: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 16,
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  detailBody: {
    marginVertical: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  badgeContainerDetail: {
    flexDirection: 'row',
    gap: 8,
  },
  infoSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 14,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    marginTop: 2,
  },
  detailFooter: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  footerActionBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banBtn: {
    backgroundColor: '#EF4444',
  },
  unbanBtn: {
    backgroundColor: '#10B981',
  },
  closeActionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  footerActionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerCloseBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerLoader: {
    marginVertical: 16,
    alignItems: 'center',
  },
});

export default ManageUsers;
