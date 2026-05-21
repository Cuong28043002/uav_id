import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
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

const ZonesMap = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axiosClient.get('/flight/zones');
        setZones(response.data?.data || []);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải bản đồ vùng cấm bay.');
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  const renderZoneItem = ({ item }) => {
    const isForbidden = item.zone_type === 'forbidden';
    const isRestricted = item.zone_type === 'restricted';
    const color = isForbidden ? '#EF4444' : isRestricted ? '#F59E0B' : '#10B981';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.zoneName}>{item.name}</Text>
          <View style={[styles.badge, { backgroundColor: color + '15', borderColor: color }]}>
            <Text style={[styles.badgeText, { color: color }]}>
              {isForbidden ? 'CẤM BAY' : isRestricted ? 'HẠN CHẾ' : 'TỰ DO'}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description || 'Không có mô tả chi tiết.'}</Text>
        <View style={styles.footer}>
          <Ionicons name="location-sharp" size={14} color="#64748B" />
          <Text style={styles.locationText}>Khu vực phân định không phận</Text>
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
            <Text style={styles.headerTitle}>Bản Đồ Phân Vùng Không Phận</Text>
          </View>

          <View style={styles.mapMock}>
            <View style={styles.radarLine} />
            <Ionicons name="navigate" size={32} color="#0080FF" style={styles.userLocation} />
            <View style={[styles.mockZone, styles.zone1]} />
            <View style={[styles.mockZone, styles.zone2]} />
            <Text style={styles.mapLabel}>TÌNH HÌNH KHÔNG PHẬN THỜI GIAN THỰC</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={zones}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderZoneItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapMock: {
    height: 180,
    backgroundColor: '#E2E8F0',
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(0, 128, 255, 0.25)',
  },
  userLocation: {
    transform: [{ rotate: '45deg' }],
  },
  mockZone: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
  },
  zone1: {
    width: 80,
    height: 80,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    top: 20,
    left: 40,
  },
  zone2: {
    width: 100,
    height: 100,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    bottom: 10,
    right: 30,
  },
  mapLabel: {
    position: 'absolute',
    bottom: 8,
    color: '#475569',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  zoneName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    color: '#475569',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  locationText: {
    color: '#64748B',
    fontSize: 11,
    marginLeft: 6,
  },
});

export default ZonesMap;
