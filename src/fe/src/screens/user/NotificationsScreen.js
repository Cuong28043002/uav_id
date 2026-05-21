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
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await axiosClient.get('/notifications');
      setNotifications(response.data?.data || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách thông báo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const response = await axiosClient.patch('/notifications/read-all');
      if (response.data?.success) {
        setNotifications((prev) =>
          prev.map((item) => ({ ...item, is_read: true }))
        );
        Alert.alert('Thành công', 'Đã đánh dấu tất cả thông báo là đã đọc.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Thao tác thất bại.');
    }
  };

  const handleMarkRead = async (id, isRead) => {
    if (isRead) return;
    try {
      const response = await axiosClient.patch(`/notifications/${id}/read`);
      if (response.data?.success) {
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosClient.delete(`/notifications/${id}`);
      if (response.data?.success) {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa thông báo.');
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.is_read && styles.unreadCard]}
      onPress={() => handleMarkRead(item.id, item.is_read)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          {!item.is_read && <View style={styles.unreadDot} />}
          <Text style={[styles.title, !item.is_read && styles.boldText]}>
            {item.title}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timeText}>
        {new Date(item.createdAt).toLocaleString('vi-VN')}
      </Text>
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
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Thông Báo</Text>
            </View>
            {notifications.some((n) => !n.is_read) && (
              <TouchableOpacity style={styles.readAllBtn} onPress={handleMarkAllRead}>
                <Text style={styles.readAllText}>Đọc tất cả</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0080FF" />
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderNotificationItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="notifications-off-outline" size={48} color="#64748B" />
                  <Text style={styles.emptyText}>Bạn không có thông báo nào</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  readAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#EBF3FC',
    borderRadius: 6,
  },
  readAllText: {
    color: '#0080FF',
    fontSize: 13,
    fontWeight: 'bold',
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
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    borderColor: '#0080FF',
    backgroundColor: '#F0F7FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0080FF',
    marginRight: 8,
  },
  title: {
    color: '#1E293B',
    fontSize: 14,
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  deleteBtn: {
    padding: 4,
  },
  content: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
    marginTop: 16,
  },
});

export default NotificationsScreen;
