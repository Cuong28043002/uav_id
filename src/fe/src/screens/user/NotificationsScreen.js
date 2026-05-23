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

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (pageNum, isRefresh = false) => {
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
      const response = await axiosClient.get('/notifications', {
        params: {
          page: pageNum,
          limit: 10,
        },
      });
      const data = response.data?.data || [];

      if (pageNum === 1) {
        setNotifications(data);
      } else {
        setNotifications((prev) => {
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
      Alert.alert('Lỗi', 'Không thể tải danh sách thông báo.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const handleRefresh = () => {
    setPage(1);
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

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

  const renderNotificationItem = ({ item }) => {
    const isUnread = !item.is_read;
    const titleText = item.title || '';
    
    // Choose icon and color based on title prefix indicators
    let iconName = "notifications-outline";
    let iconColor = "#0080FF";
    let iconBg = "#EFF6FF";
    
    if (titleText.includes('⚠️') || titleText.includes('phạt') || titleText.includes('vi phạm')) {
      iconName = "warning-outline";
      iconColor = "#EF4444";
      iconBg = "#FEF2F2";
    } else if (titleText.includes('✅') || titleText.includes('duyệt') || titleText.includes('thành công')) {
      iconName = "checkmark-circle-outline";
      iconColor = "#10B981";
      iconBg = "#F0FDF4";
    } else if (titleText.includes('❌') || titleText.includes('từ chối')) {
      iconName = "close-circle-outline";
      iconColor = "#F59E0B";
      iconBg = "#FFFBEB";
    }

    return (
      <TouchableOpacity
        style={[styles.card, isUnread && styles.unreadCard]}
        onPress={() => handleMarkRead(item.id, item.is_read)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Ionicons name={iconName} size={20} color={iconColor} />
          </View>
          <View style={styles.titleCol}>
            <Text style={[styles.title, isUnread && styles.boldText]}>
              {item.title}
            </Text>
            <Text style={styles.timeText}>
              {formatDisplayDateTime(item.createdAt)}
            </Text>
          </View>
          {isUnread && <View style={styles.unreadBadge} />}
        </View>
        <Text style={[styles.content, isUnread && styles.unreadContent]}>{item.content}</Text>
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
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Hộp Thư Thông Báo</Text>
            </View>
            {notifications.some((n) => !n.is_read) && (
              <TouchableOpacity style={styles.readAllBtn} onPress={handleMarkAllRead}>
                <Ionicons name="mail-open-outline" size={16} color="#0080FF" style={{ marginRight: 4 }} />
                <Text style={styles.readAllText}>Đọc tất cả</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading && page === 1 ? (
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
                  <Ionicons name="notifications-off-outline" size={48} color="#94A3B8" />
                  <Text style={styles.emptyText}>Hộp thư thông báo của bạn đang trống</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
  },
  readAllText: {
    color: '#0080FF',
    fontSize: 13,
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
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
  },
  title: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0080FF',
    alignSelf: 'center',
  },
  content: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
  },
  unreadContent: {
    color: '#334155',
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

export default NotificationsScreen;
