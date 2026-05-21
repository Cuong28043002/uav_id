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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

const ManageUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get(`/users?q=${search}`);
      setUsers(response.data?.data || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy danh sách người dùng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

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

  const renderUserItem = ({ item }) => {
    const getRoleName = (item) => {
      if (item.role?.name) return item.role.name.toUpperCase();
      if (item.role_id === 1) return 'ADMIN';
      if (item.role_id === 2) return 'POLICE';
      return 'USER';
    };

    const isBanned = item.status !== 'active';

    return (
      <View style={styles.card}>
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
            <Text style={styles.headerTitle}>Quản Lý Tài Khoản</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên, email, SĐT..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

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
              onRefresh={() => {
                setRefreshing(true);
                fetchUsers();
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Không tìm thấy tài khoản nào</Text>
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
});

export default ManageUsers;
