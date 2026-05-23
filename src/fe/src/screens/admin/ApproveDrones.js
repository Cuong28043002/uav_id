import React, { useState, useEffect, useRef } from 'react';
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
  ImageBackground,
  Modal,
  ScrollView,
  Dimensions,
  Image,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../../api/axiosClient';
import Alert from '../../components/CustomAlert';

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

const ApproveDrones = ({ navigation }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  // Review Wizard States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [reviewStep, setReviewStep] = useState(1); // 1: Info & Photos, 2: Plate, 3: Signature
  
  // Plate Selection States
  const [generatedPlates, setGeneratedPlates] = useState([]);
  const [selectedPlate, setSelectedPlate] = useState('');
  const [isSpinningPlate, setIsSpinningPlate] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [customPlateInput, setCustomPlateInput] = useState('');

  // Signature States
  const [signatureType, setSignatureType] = useState('cursive'); // 'cursive' or 'handwritten'
  const [cursiveName, setCursiveName] = useState('Sĩ quan tuần tra');
  const [selectedCursiveStyle, setSelectedCursiveStyle] = useState(0);
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Advanced Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedManuf, setSelectedManuf] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState(''); // 'createdFrom' or 'createdTo'

  const spinInterval = useRef(null);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [manufRes, catRes] = await Promise.all([
          axiosClient.get('/manufacturers'),
          axiosClient.get('/drone-categories'),
        ]);
        setManufacturers(manufRes.data?.data || []);
        setCategories(catRes.data?.data || []);
      } catch (err) {
        console.log('Error fetching filter data:', err);
      }
    };
    fetchFilterData();
  }, []);

  const fetchRegistrations = async (pageNum = 1, isRefresh = false) => {
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
      let url = `/registrations?status=${activeTab}&page=${pageNum}&limit=10`;
      if (searchQuery.trim()) {
        url += `&q=${encodeURIComponent(searchQuery.trim())}`;
      }
      if (selectedManuf) {
        url += `&manufacturer_id=${selectedManuf}`;
      }
      if (selectedCat) {
        url += `&category_id=${selectedCat}`;
      }
      if (createdFrom) {
        url += `&created_from=${createdFrom}`;
      }
      if (createdTo) {
        url += `&created_to=${createdTo}`;
      }
      const response = await axiosClient.get(url);
      const newData = response.data?.data || [];
      const meta = response.data?.meta;

      if (pageNum === 1) {
        setRegistrations(newData);
        setExpandedId(null);
        setShowRejectForm(false);
        setRejectNote('');
      } else {
        setRegistrations((prev) => [...prev, ...newData]);
      }

      if (meta) {
        setHasMore(pageNum < meta.totalPages);
      } else {
        setHasMore(newData.length >= 10);
      }
      setPage(pageNum);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách hồ sơ.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrations(1, false);
  }, [activeTab]);

  const handleRefresh = () => {
    fetchRegistrations(1, true);
  };

  const loadMoreRegistrations = () => {
    if (loading || loadingMore || !hasMore) return;
    fetchRegistrations(page + 1, false);
  };

  const handleOpenReview = (reg) => {
    setSelectedReg(reg);
    setReviewStep(1);
    
    // Generate 5 lucky plates based on serial number and random codes
    const serialSuffix = reg.drone?.serial_number ? reg.drone.serial_number.slice(-3).toUpperCase() : '888';
    const cleanSerial = serialSuffix.replace(/[^A-Z0-9]/g, '9');
    const plates = [
      `UAV-29-A1.${cleanSerial}88`,
      `UAV-30-C2.888.88`,
      `UAV-59-H9.666.86`,
      `UAV-43-D1.999.99`,
      `UAV-79-K8.123.45`,
    ];
    setGeneratedPlates(plates);
    setSelectedPlate('');
    setHasSpun(false);
    setCustomPlateInput('');
    setPoints([]);
    setSignatureType('cursive');
    setCursiveName(reg.admin_note ? 'Cán bộ kiểm định' : 'Nguyễn Văn Hùng');
    setModalVisible(true);
  };

  const startSpinningPlate = () => {
    if (isSpinningPlate) return;
    setIsSpinningPlate(true);
    setHasSpun(true);
    let counter = 0;
    
    spinInterval.current = setInterval(() => {
      setSpinIndex((prev) => (prev + 1) % generatedPlates.length);
      counter++;
      if (counter >= 15) {
        clearInterval(spinInterval.current);
        const finalIdx = Math.floor(Math.random() * generatedPlates.length);
        setSpinIndex(finalIdx);
        setSelectedPlate(generatedPlates[finalIdx]);
        setIsSpinningPlate(false);
      }
    }, 100);
  };

  // Handwritten Signature drawing handlers
  const handleTouchStart = (e) => {
    if (signatureType !== 'handwritten') return;
    setIsDrawing(true);
    const { locationX, locationY } = e.nativeEvent;
    setPoints([{ x: locationX, y: locationY }]);
  };

  const handleTouchMove = (e) => {
    if (signatureType !== 'handwritten' || !isDrawing) return;
    const { locationX, locationY } = e.nativeEvent;
    setPoints((prev) => [...prev, { x: locationX, y: locationY }]);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const handleApproveWithPlateAndSignature = async () => {
    const finalPlate = customPlateInput.trim() ? customPlateInput.trim().toUpperCase() : selectedPlate;
    
    if (!finalPlate) {
      Alert.alert('Thông báo', 'Vui lòng bốc biển số ngẫu nhiên hoặc nhập biển số tùy chọn.');
      return;
    }
    
    if (signatureType === 'handwritten' && points.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng ký tên xác nhận ở ô chữ ký điện tử.');
      return;
    }

    setReviewLoading(true);
    try {
      const response = await axiosClient.patch(`/registrations/${selectedReg.id}/review`, {
        status: 'approved',
        identification_code: finalPlate,
        admin_note: `Đã thẩm duyệt hồ sơ định danh UAV và cấp biển số. Chữ ký xác thực điện tử của cán bộ kiểm định.`,
        signature: signatureType === 'handwritten' ? JSON.stringify(points) : `cursive:${selectedCursiveStyle}:${cursiveName}`,
      });

      if (response.data?.success) {
        Alert.alert(
          'Thành công',
          `Thiết bị đã được cấp biển số định danh quốc gia: ${finalPlate}!`,
          [
            {
              text: 'Xem chi tiết UAV',
              onPress: () => {
                setModalVisible(false);
                fetchRegistrations();
                navigation.navigate('DroneDetail', { droneId: selectedReg.drone_id });
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Phê duyệt thất bại.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectNote.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập lý do từ chối hồ sơ.');
      return;
    }
    try {
      const response = await axiosClient.patch(`/registrations/${id}/review`, {
        status: 'rejected',
        admin_note: rejectNote,
      });
      if (response.data?.success) {
        Alert.alert('Thành công', 'Đã từ chối hồ sơ định danh này.');
        setRegistrations((prev) => prev.filter((item) => item.id !== id));
        setShowRejectForm(false);
        setRejectNote('');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Thao tác thất bại.');
    }
  };

  const handleRevoke = async (id) => {
    if (!rejectNote.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập lý do thu hồi.');
      return;
    }
    try {
      const response = await axiosClient.patch(`/registrations/${id}/revoke`, {
        admin_note: rejectNote,
      });
      if (response.data?.success) {
        Alert.alert('Thành công', 'Đã thu hồi mã định danh UAV này.');
        setRegistrations((prev) => prev.filter((item) => item.id !== id));
        setShowRejectForm(false);
        setRejectNote('');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Thao tác thất bại.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setShowRejectForm(false);
    setRejectNote('');
  };

  const renderRegistrationItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand(item.id)}>
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.modelName}>{item.drone?.model_name || 'Không rõ thiết bị'}</Text>
              <View style={[styles.statusBadge, 
                item.status === 'approved' ? styles.statusApproved : 
                item.status === 'rejected' ? styles.statusRejected : 
                item.status === 'revoked' ? styles.statusRevoked : styles.statusPending
              ]}>
                <Text style={[styles.statusBadgeText,
                  item.status === 'approved' ? styles.statusApprovedText : 
                  item.status === 'rejected' ? styles.statusRejectedText : 
                  item.status === 'revoked' ? styles.statusRevokedText : styles.statusPendingText
                ]}>
                  {item.status === 'approved' ? 'Đã duyệt' : 
                   item.status === 'rejected' ? 'Từ chối' : 
                   item.status === 'revoked' ? 'Đã thu hồi' : 'Chờ duyệt'}
                </Text>
              </View>
            </View>
            <Text style={styles.serialNumber}>S/N: {item.drone?.serial_number}</Text>
            <Text style={styles.ownerText}>
              Chủ sở hữu: {item.drone?.owner?.full_name || 'Chưa cập nhật'}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.detailsContainer}>
            <View style={styles.divider} />
            <Text style={styles.detailsTitle}>Thông số kỹ thuật thiết bị:</Text>
            <Text style={styles.detailsText}>- Trọng lượng: {item.drone?.weight || '2.4'} kg</Text>
            <Text style={styles.detailsText}>- Độ cao tối đa: {item.drone?.max_flight_height || '500'} m</Text>
            <Text style={styles.detailsText}>
              - Nhà sản xuất: {item.drone?.manufacturer?.name || 'DJI'} ({item.drone?.manufacturer?.country || 'China'})
            </Text>
            <Text style={styles.detailsText}>- Phân loại: {item.drone?.category?.name || 'Quadcopter'}</Text>

            <TouchableOpacity
              style={styles.viewDroneBtn}
              onPress={() => navigation.navigate('DroneDetail', { droneId: item.drone_id })}
            >
              <Ionicons name="eye-outline" size={15} color="#0080FF" style={{ marginRight: 6 }} />
              <Text style={styles.viewDroneBtnText}>Xem chi tiết lịch sử & thông tin UAV</Text>
            </TouchableOpacity>

            <Text style={[styles.detailsTitle, { marginTop: 10 }]}>Hồ sơ đăng ký:</Text>
            <Text style={styles.detailsText}>- Ngày tạo: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
            {item.identification_code && (
              <View style={styles.plateRow}>
                <Text style={styles.detailsText}>- Biển định danh cấp phát:</Text>
                <View style={styles.plateMiniBadge}>
                  <Text style={styles.plateMiniText}>{item.identification_code}</Text>
                </View>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => {
                    Clipboard.setString(item.identification_code);
                    Alert.alert('Đã sao chép', `Đã sao chép mã định danh "${item.identification_code}" vào khay nhớ tạm.`);
                  }}
                >
                  <Ionicons name="copy-outline" size={15} color="#0080FF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            )}
            {item.admin_note && (
              <Text style={styles.detailsText}>
                {item.status === 'revoked' ? `- Lý do thu hồi: ${item.admin_note}` : `- Phản hồi thẩm định: ${item.admin_note}`}
              </Text>
            )}

            {activeTab === 'pending' && (
              <View style={styles.actionContainer}>
                {!showRejectForm ? (
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleOpenReview(item)}
                    >
                      <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.btnText}>Thẩm định & Cấp biển</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => setShowRejectForm(true)}
                    >
                      <Ionicons name="close-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.btnText}>Từ chối hồ sơ</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.rejectForm}>
                    <TextInput
                      style={styles.reasonInput}
                      placeholder="Lý do từ chối hồ sơ..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={3}
                      value={rejectNote}
                      onChangeText={setRejectNote}
                    />
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.submitRejectBtn]}
                        onPress={() => handleReject(item.id)}
                      >
                        <Text style={styles.btnText}>Xác nhận từ chối</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.cancelBtn]}
                        onPress={() => {
                          setShowRejectForm(false);
                          setRejectNote('');
                        }}
                      >
                        <Text style={styles.btnText}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'approved' && (
              <View style={styles.actionContainer}>
                {!showRejectForm ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.revokeBtn]}
                    onPress={() => setShowRejectForm(true)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.btnText}>Thu hồi mã định danh</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.rejectForm}>
                    <TextInput
                      style={styles.reasonInput}
                      placeholder="Lý do thu hồi mã định danh..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={3}
                      value={rejectNote}
                      onChangeText={setRejectNote}
                    />
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.submitRejectBtn]}
                        onPress={() => handleRevoke(item.id)}
                      >
                        <Text style={styles.btnText}>Xác nhận thu hồi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.cancelBtn]}
                        onPress={() => {
                          setShowRejectForm(false);
                          setRejectNote('');
                        }}
                      >
                        <Text style={styles.btnText}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
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
            <Text style={styles.headerTitle}>Phê Duyệt Định Danh UAV</Text>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'pending' && styles.activeTabItem]}
              onPress={() => setActiveTab('pending')}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                Chờ duyệt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'approved' && styles.activeTabItem]}
              onPress={() => setActiveTab('approved')}
            >
              <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>
                Đã cấp biển
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'rejected' && styles.activeTabItem]}
              onPress={() => setActiveTab('rejected')}
            >
              <Text style={[styles.tabText, activeTab === 'rejected' && styles.activeTabText]}>
                Từ chối
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'revoked' && styles.activeTabItem]}
              onPress={() => setActiveTab('revoked')}
            >
              <Text style={[styles.tabText, activeTab === 'revoked' && styles.activeTabText]}>
                Đã thu hồi
              </Text>
            </TouchableOpacity>
          </View>

          {/* SEARCH & FILTER BAR */}
          <View style={styles.searchFilterContainer}>
            <View style={styles.searchBarWrapper}>
              <Ionicons name="search" size={18} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm mã, S/N, mẫu UAV, tên, SĐT..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => fetchRegistrations(1)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchQuery(''); setTimeout(() => fetchRegistrations(1), 50); }} style={styles.clearSearchIcon}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={[styles.filterToggleBtn, (selectedManuf || selectedCat || createdFrom || createdTo || showFilters) && styles.filterToggleBtnActive]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons 
                name={showFilters ? "funnel" : "funnel-outline"} 
                size={20} 
                color={selectedManuf || selectedCat || createdFrom || createdTo || showFilters ? "#FFFFFF" : "#64748B"} 
              />
            </TouchableOpacity>
          </View>

          {/* ADVANCED FILTER PANEL */}
          {showFilters && (
            <View style={styles.advancedFiltersPanel}>
              <Text style={styles.filterGroupTitle}>Bộ lọc nâng cao</Text>

              {/* Manufacturer selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Nhà sản xuất</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                  <TouchableOpacity
                    style={[styles.chip, !selectedManuf && styles.chipActive]}
                    onPress={() => setSelectedManuf('')}
                  >
                    <Text style={[styles.chipText, !selectedManuf && styles.chipTextActive]}>Tất cả</Text>
                  </TouchableOpacity>
                  {manufacturers.map((manuf) => (
                    <TouchableOpacity
                      key={manuf.id}
                      style={[styles.chip, selectedManuf === manuf.id.toString() && styles.chipActive]}
                      onPress={() => setSelectedManuf(manuf.id.toString())}
                    >
                      <Text style={[styles.chipText, selectedManuf === manuf.id.toString() && styles.chipTextActive]}>
                        {manuf.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Category selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Phân loại thiết bị</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
                  <TouchableOpacity
                    style={[styles.chip, !selectedCat && styles.chipActive]}
                    onPress={() => setSelectedCat('')}
                  >
                    <Text style={[styles.chipText, !selectedCat && styles.chipTextActive]}>Tất cả</Text>
                  </TouchableOpacity>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.chip, selectedCat === cat.id.toString() && styles.chipActive]}
                      onPress={() => setSelectedCat(cat.id.toString())}
                    >
                      <Text style={[styles.chipText, selectedCat === cat.id.toString() && styles.chipTextActive]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Created Date inputs */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Thời gian gửi (Năm-Tháng-Ngày)</Text>
                <View style={styles.dateInputsRow}>
                  <TouchableOpacity
                    style={styles.dateInputBtn}
                    onPress={() => {
                      setDatePickerTarget('createdFrom');
                      setDatePickerVisible(true);
                    }}
                  >
                    <Text style={[styles.dateInputBtnText, !createdFrom && styles.datePlaceholderText]}>
                      {createdFrom || 'Từ ngày'}
                    </Text>
                    {createdFrom ? (
                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          setCreatedFrom('');
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
                      setDatePickerTarget('createdTo');
                      setDatePickerVisible(true);
                    }}
                  >
                    <Text style={[styles.dateInputBtnText, !createdTo && styles.datePlaceholderText]}>
                      {createdTo || 'Đến ngày'}
                    </Text>
                    {createdTo ? (
                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          setCreatedTo('');
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

              {/* Action buttons */}
              <View style={styles.filterActionsRow}>
                <TouchableOpacity 
                  style={styles.resetFilterBtn} 
                  onPress={() => {
                    setSelectedManuf('');
                    setSelectedCat('');
                    setCreatedFrom('');
                    setCreatedTo('');
                    setShowFilters(false);
                    setTimeout(() => {
                      fetchRegistrations(1);
                    }, 50);
                  }}
                >
                  <Text style={styles.resetFilterBtnText}>Thiết lập lại</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.applyFilterBtn}
                  onPress={() => {
                    setShowFilters(false);
                    fetchRegistrations(1);
                  }}
                >
                  <Text style={styles.applyFilterBtnText}>Áp dụng bộ lọc</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0080FF" />
            </View>
          ) : (
            <FlatList
              data={registrations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRegistrationItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreRegistrations}
              onEndReachedThreshold={0.2}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListFooterComponent={
                loadingMore ? (
                  <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="#0080FF" />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="document-text-outline" size={48} color="#94A3B8" />
                  <Text style={styles.emptyText}>Không tìm thấy hồ sơ nào phù hợp.</Text>
                </View>
              }
            />
          )}

          {/* Custom Date Picker Modal */}
          <CustomDatePickerModal
            visible={datePickerVisible}
            onClose={() => setDatePickerVisible(false)}
            value={datePickerTarget === 'createdFrom' ? createdFrom : createdTo}
            onSelect={(dateStr) => {
              if (datePickerTarget === 'createdFrom') {
                setCreatedFrom(dateStr);
              } else {
                setCreatedTo(dateStr);
              }
              setDatePickerVisible(false);
            }}
          />

          {/* WIZARD REVIEW MODAL */}
          {selectedReg && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalHeaderTitle}>Thẩm Định Thiết Bị UAV</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                      <Ionicons name="close" size={24} color="#0F172A" />
                    </TouchableOpacity>
                  </View>

                  {/* Progress Indicator */}
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressStep, reviewStep >= 1 && styles.progressStepActive]}>
                      <Text style={[styles.progressStepNum, reviewStep >= 1 && styles.progressStepNumActive]}>1</Text>
                      <Text style={styles.progressStepLabel}>Hồ sơ & Ảnh</Text>
                    </View>
                    <View style={styles.progressLine} />
                    <View style={[styles.progressStep, reviewStep >= 2 && styles.progressStepActive]}>
                      <Text style={[styles.progressStepNum, reviewStep >= 2 && styles.progressStepNumActive]}>2</Text>
                      <Text style={styles.progressStepLabel}>Bốc biển số</Text>
                    </View>
                    <View style={styles.progressLine} />
                    <View style={[styles.progressStep, reviewStep >= 3 && styles.progressStepActive]}>
                      <Text style={[styles.progressStepNum, reviewStep >= 3 && styles.progressStepNumActive]}>3</Text>
                      <Text style={styles.progressStepLabel}>Ký phê duyệt</Text>
                    </View>
                  </View>

                  <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                    
                    {/* STEP 1: SPECIFICATION AND PHOTOS */}
                    {reviewStep === 1 && (
                      <View style={styles.stepContent}>
                        <View style={styles.stepTitleBox}>
                          <Ionicons name="document-text" size={20} color="#0080FF" />
                          <Text style={styles.stepTitle}>Kiểm tra thông số kỹ thuật thực địa</Text>
                        </View>

                        <View style={styles.specsBox}>
                          <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Mẫu UAV:</Text>
                            <Text style={styles.specVal}>{selectedReg.drone?.model_name}</Text>
                          </View>
                          <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Số S/N sản xuất:</Text>
                            <Text style={styles.specVal}>{selectedReg.drone?.serial_number}</Text>
                          </View>
                          <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Khối lượng rỗng:</Text>
                            <Text style={styles.specVal}>{selectedReg.drone?.weight || '2.4'} kg</Text>
                          </View>
                          <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Trần bay tối đa:</Text>
                            <Text style={styles.specVal}>{selectedReg.drone?.max_flight_height || '500'} m</Text>
                          </View>
                          <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Chủ sở hữu:</Text>
                            <Text style={styles.specVal}>{selectedReg.drone?.owner?.full_name}</Text>
                          </View>
                          <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Số điện thoại:</Text>
                            <Text style={styles.specVal}>{selectedReg.drone?.owner?.phone || 'N/A'}</Text>
                          </View>
                        </View>

                        <View style={[styles.stepTitleBox, { marginTop: 20 }]}>
                          <Ionicons name="images" size={20} color="#0080FF" />
                          <Text style={styles.stepTitle}>Hình ảnh chụp kiểm chứng thực tế</Text>
                        </View>

                        {/* Image Gallery */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
                          {(() => {
                            let docList = [];
                            if (selectedReg.documents) {
                              if (Array.isArray(selectedReg.documents)) {
                                docList = selectedReg.documents;
                              } else if (typeof selectedReg.documents === 'string') {
                                try {
                                  const parsed = JSON.parse(selectedReg.documents);
                                  if (Array.isArray(parsed)) {
                                    docList = parsed;
                                  } else {
                                    docList = [selectedReg.documents];
                                  }
                                } catch (e) {
                                  if (selectedReg.documents.trim().startsWith('http') || selectedReg.documents.trim().startsWith('file:')) {
                                    docList = [selectedReg.documents.trim()];
                                  }
                                }
                              }
                            }
                            if (docList.length > 0) {
                              return docList.map((img, idx) => (
                                <View key={idx} style={styles.galleryCard}>
                                  <Image source={{ uri: img }} style={styles.galleryImg} />
                                  <Text style={styles.galleryText}>Ảnh đính kèm {idx + 1}</Text>
                                </View>
                              ));
                            } else {
                              return (
                                <>
                                  <View style={styles.galleryCard}>
                                    <View style={[styles.galleryPlaceholder, { backgroundColor: '#EFF6FF' }]}>
                                      <Ionicons name="airplane" size={32} color="#0080FF" />
                                    </View>
                                    <Text style={styles.galleryText}>Góc nghiêng 45°</Text>
                                  </View>
                                  <View style={styles.galleryCard}>
                                    <View style={[styles.galleryPlaceholder, { backgroundColor: '#F0FDF4' }]}>
                                      <Ionicons name="barcode-outline" size={32} color="#10B981" />
                                    </View>
                                    <Text style={styles.galleryText}>Tem nhãn S/N</Text>
                                  </View>
                                  <View style={styles.galleryCard}>
                                    <View style={[styles.galleryPlaceholder, { backgroundColor: '#FFF7ED' }]}>
                                      <Ionicons name="card-outline" size={32} color="#F97316" />
                                    </View>
                                    <Text style={styles.galleryText}>Đơn đề nghị cấp</Text>
                                  </View>
                                </>
                              );
                            }
                          })()}
                        </ScrollView>
                      </View>
                    )}

                    {/* STEP 2: PLATE PICKER (BẤM BIỂN SỐ) */}
                    {reviewStep === 2 && (
                      <View style={styles.stepContent}>
                        <View style={styles.stepTitleBox}>
                          <Ionicons name="sparkles" size={20} color="#0080FF" />
                          <Text style={styles.stepTitle}>Bốc biển số định danh ngẫu nhiên</Text>
                        </View>

                        <Text style={styles.stepDesc}>
                          Nhấn nút bắt đầu để quay số biển định danh quốc gia cấp phát cho thiết bị.
                        </Text>

                        {/* License Plate Display */}
                        <View style={styles.plateDisplayContainer}>
                          <LinearGradient
                            colors={['#004B87', '#003366']}
                            style={styles.plateBody}
                          >
                            <View style={styles.plateBorder}>
                              <View style={styles.plateHeaderInner}>
                                <Text style={styles.plateHeaderText}>UAV ID NATIONAL REGISTRATION</Text>
                              </View>
                              <Text style={styles.plateNumberText}>
                                {isSpinningPlate 
                                  ? generatedPlates[spinIndex] 
                                  : selectedPlate || 'UAV-XX-XX.XXXX'}
                              </Text>
                              <View style={styles.plateFooterInner}>
                                <View style={styles.plateDot} />
                                <Text style={styles.plateFooterText}>BỘ CÔNG AN - CỤC HÀNG KHÔNG</Text>
                                <View style={styles.plateDot} />
                              </View>
                            </View>
                          </LinearGradient>
                        </View>

                        {/* Spin Button */}
                        <TouchableOpacity
                          style={[styles.spinBtn, isSpinningPlate && styles.spinBtnDisabled]}
                          onPress={startSpinningPlate}
                          disabled={isSpinningPlate}
                        >
                          <Ionicons name="sync" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                          <Text style={styles.spinBtnText}>
                            {isSpinningPlate ? 'ĐANG BỐC BIỂN...' : 'BẤM NÚT BỐC BIỂN SỐ'}
                          </Text>
                        </TouchableOpacity>

                        {/* Alternatives List */}
                        {hasSpun && !isSpinningPlate && (
                          <View style={styles.alternativesBox}>
                            <Text style={styles.altTitle}>Danh sách biển số ngẫu nhiên dự phòng:</Text>
                            <View style={styles.altList}>
                              {generatedPlates.map((plate, idx) => (
                                <TouchableOpacity
                                  key={idx}
                                  style={[styles.altItem, selectedPlate === plate && styles.altItemActive]}
                                  onPress={() => setSelectedPlate(plate)}
                                >
                                  <Text style={[styles.altText, selectedPlate === plate && styles.altTextActive]}>
                                    {plate}
                                  </Text>
                                  {selectedPlate === plate && (
                                    <Ionicons name="checkmark-circle" size={16} color="#0080FF" />
                                  )}
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Custom Input */}
                        <View style={[styles.inputWrapper, { marginTop: 24 }]}>
                          <Text style={styles.inputLabel}>Tùy biến nhập biển định danh khác (nếu có):</Text>
                          <TextInput
                            style={styles.customPlateInput}
                            placeholder="Ví dụ: UAV-29-A1.99999"
                            placeholderTextColor="#94A3B8"
                            value={customPlateInput}
                            onChangeText={setCustomPlateInput}
                            autoCapitalize="characters"
                          />
                        </View>
                      </View>
                    )}

                    {/* STEP 3: ELECTRONIC SIGNATURE */}
                    {reviewStep === 3 && (
                      <View style={styles.stepContent}>
                        <View style={styles.stepTitleBox}>
                          <Ionicons name="create" size={20} color="#0080FF" />
                          <Text style={styles.stepTitle}>Chữ ký số xác nhận của Sĩ quan</Text>
                        </View>

                        <Text style={styles.stepDesc}>
                          Chọn phương thức ký tên và hoàn tất hồ sơ thẩm định phê duyệt.
                        </Text>

                        {/* Signature Type Toggle */}
                        <View style={styles.sigToggle}>
                          <TouchableOpacity
                            style={[styles.sigToggleBtn, signatureType === 'cursive' && styles.sigToggleBtnActive]}
                            onPress={() => setSignatureType('cursive')}
                          >
                            <Ionicons name="text" size={16} color={signatureType === 'cursive' ? '#FFFFFF' : '#64748B'} />
                            <Text style={[styles.sigToggleText, signatureType === 'cursive' && styles.sigToggleTextActive]}>
                              Ký số Calligraphy
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.sigToggleBtn, signatureType === 'handwritten' && styles.sigToggleBtnActive]}
                            onPress={() => setSignatureType('handwritten')}
                          >
                            <Ionicons name="brush" size={16} color={signatureType === 'handwritten' ? '#FFFFFF' : '#64748B'} />
                            <Text style={[styles.sigToggleText, signatureType === 'handwritten' && styles.sigToggleTextActive]}>
                              Ký tay màn hình
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {/* CURSIVE SIGNATURE GENERATOR */}
                        {signatureType === 'cursive' && (
                          <View style={styles.sigPanel}>
                            <View style={styles.inputWrapper}>
                              <Text style={styles.inputLabel}>Nhập họ tên đầy đủ để sinh chữ ký:</Text>
                              <TextInput
                                style={styles.sigNameInput}
                                value={cursiveName}
                                onChangeText={setCursiveName}
                                placeholder="Nhập tên..."
                              />
                            </View>

                            <Text style={styles.styleSelectTitle}>Chọn kiểu chữ ký nghệ thuật:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleScroll}>
                              <TouchableOpacity
                                style={[styles.cursiveCard, selectedCursiveStyle === 0 && styles.cursiveCardActive]}
                                onPress={() => setSelectedCursiveStyle(0)}
                              >
                                <Text style={[styles.cursiveSigText, { fontFamily: 'serif', fontStyle: 'italic', fontWeight: 'bold' }]}>
                                  {cursiveName || 'Nguyen Van A'}
                                </Text>
                                <Text style={styles.cursiveStyleLabel}>Phong cách Cổ điển</Text>
                              </TouchableOpacity>
                              
                              <TouchableOpacity
                                style={[styles.cursiveCard, selectedCursiveStyle === 1 && styles.cursiveCardActive]}
                                onPress={() => setSelectedCursiveStyle(1)}
                              >
                                <Text style={[styles.cursiveSigText, { fontStyle: 'italic', textDecorationLine: 'underline', letterSpacing: 2 }]}>
                                  {cursiveName || 'Nguyen Van A'}
                                </Text>
                                <Text style={styles.cursiveStyleLabel}>Phong cách Hiện đại</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={[styles.cursiveCard, selectedCursiveStyle === 2 && styles.cursiveCardActive]}
                                onPress={() => setSelectedCursiveStyle(2)}
                              >
                                <Text style={[styles.cursiveSigText, { fontFamily: 'monospace', fontWeight: 'bold', fontStyle: 'italic' }]}>
                                  {cursiveName || 'Nguyen Van A'}
                                </Text>
                                <Text style={styles.cursiveStyleLabel}>Phong cách Kỹ thuật</Text>
                              </TouchableOpacity>
                            </ScrollView>
                          </View>
                        )}

                        {/* HANDWRITTEN SIGNATURE BOARD */}
                        {signatureType === 'handwritten' && (
                          <View style={styles.sigPanel}>
                            <Text style={styles.sigInstructions}>
                              Dùng ngón tay ký trực tiếp vào khung màu trắng bên dưới:
                            </Text>

                            <View
                              style={styles.canvasContainer}
                              onTouchStart={handleTouchStart}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                            >
                              {points.length === 0 ? (
                                <View style={styles.canvasPlaceholder}>
                                  <Ionicons name="pencil" size={24} color="#CBD5E1" />
                                  <Text style={styles.canvasPlaceholderText}>Khung vẽ chữ ký</Text>
                                </View>
                              ) : (
                                points.map((p, idx) => (
                                  <View
                                    key={idx}
                                    style={{
                                      position: 'absolute',
                                      left: p.x - 2,
                                      top: p.y - 2,
                                      width: 4,
                                      height: 4,
                                      borderRadius: 2,
                                      backgroundColor: '#0F172A',
                                    }}
                                  />
                                ))
                              )}
                            </View>

                            <TouchableOpacity
                              style={styles.clearBtn}
                              onPress={() => setPoints([])}
                            >
                              <Ionicons name="trash" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                              <Text style={styles.clearBtnText}>Xóa ký lại</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </ScrollView>

                  {/* Modal Footer Controls */}
                  <View style={styles.modalFooter}>
                    {reviewStep > 1 ? (
                      <TouchableOpacity
                        style={[styles.footerBtn, styles.prevBtn]}
                        onPress={() => setReviewStep((prev) => prev - 1)}
                      >
                        <Text style={styles.prevBtnText}>Quay lại</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ flex: 1 }} />
                    )}

                    {reviewStep < 3 ? (
                      <TouchableOpacity
                        style={[styles.footerBtn, styles.nextBtn]}
                        onPress={() => setReviewStep((prev) => prev + 1)}
                      >
                        <Text style={styles.nextBtnText}>Tiếp tục</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.footerBtn, styles.submitBtn]}
                        onPress={handleApproveWithPlateAndSignature}
                        disabled={reviewLoading}
                      >
                        {reviewLoading ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Text style={styles.submitBtnText}>Phê duyệt & Cấp biển</Text>
                            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
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
    fontSize: 13,
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 10,
  },
  statusApproved: {
    backgroundColor: '#E8F5E9',
  },
  statusApprovedText: {
    color: '#10B981',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusRejectedText: {
    color: '#EF4444',
  },
  statusPending: {
    backgroundColor: '#EFF6FF',
  },
  statusPendingText: {
    color: '#0080FF',
  },
  footerLoader: {
    marginVertical: 16,
    alignItems: 'center',
  },
  statusRevoked: {
    backgroundColor: '#F3E8FF',
  },
  statusRevokedText: {
    color: '#9333EA',
  },
  copyBtn: {
    marginLeft: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDroneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewDroneBtnText: {
    color: '#0080FF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  modelName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serialNumber: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 2,
  },
  ownerText: {
    color: '#475569',
    fontSize: 13,
  },
  detailsContainer: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  detailsTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detailsText: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  plateMiniBadge: {
    backgroundColor: '#004B87',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  plateMiniText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionContainer: {
    marginTop: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#0080FF',
    marginRight: 10,
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  revokeBtn: {
    backgroundColor: '#EF4444',
    width: '100%',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rejectForm: {
    marginTop: 8,
  },
  reasonInput: {
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  submitRejectBtn: {
    backgroundColor: '#EF4444',
    marginRight: 10,
  },
  cancelBtn: {
    backgroundColor: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
    marginTop: 10,
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.85,
    width: width,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeModalBtn: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressStepActive: {
    transform: [{ scale: 1.05 }],
  },
  progressStepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  progressStepNumActive: {
    backgroundColor: '#0080FF',
    color: '#FFFFFF',
  },
  progressStepLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginTop: -16,
  },
  modalScroll: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 8,
  },
  stepDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 20,
  },
  specsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF2F5',
  },
  specLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  specVal: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
  },
  galleryScroll: {
    marginTop: 10,
    flexDirection: 'row',
  },
  galleryCard: {
    marginRight: 14,
    alignItems: 'center',
  },
  galleryImg: {
    width: 110,
    height: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  galleryPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  galleryText: {
    marginTop: 6,
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },

  // Plate styling
  plateDisplayContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  plateBody: {
    width: width * 0.85,
    height: 110,
    borderRadius: 10,
    padding: 4,
    shadowColor: '#004B87',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  plateBorder: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  plateHeaderInner: {
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 2,
  },
  plateHeaderText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  plateNumberText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  plateFooterInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 4,
  },
  plateFooterText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 8,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  plateDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  spinBtn: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  spinBtnDisabled: {
    opacity: 0.6,
  },
  spinBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  alternativesBox: {
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  altTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 10,
  },
  altList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  altItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '48%',
  },
  altItemActive: {
    borderColor: '#0080FF',
    backgroundColor: '#EFF6FF',
  },
  altText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: 'bold',
  },
  altTextActive: {
    color: '#0080FF',
  },
  customPlateInput: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
  },

  // Signature styling
  sigToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  sigToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  sigToggleBtnActive: {
    backgroundColor: '#0080FF',
  },
  sigToggleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 'bold',
  },
  sigToggleTextActive: {
    color: '#FFFFFF',
  },
  sigPanel: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sigNameInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  styleSelectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 10,
    marginBottom: 8,
  },
  styleScroll: {
    flexDirection: 'row',
  },
  cursiveCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    width: 140,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 85,
  },
  cursiveCardActive: {
    borderColor: '#0080FF',
    backgroundColor: '#EFF6FF',
  },
  cursiveSigText: {
    fontSize: 15,
    color: '#0F172A',
    textAlign: 'center',
  },
  cursiveStyleLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 6,
  },
  sigInstructions: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  canvasContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 150,
    position: 'relative',
    overflow: 'hidden',
  },
  canvasPlaceholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  canvasPlaceholderText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  clearBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Modal Footer styling
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  footerBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  prevBtnText: {
    color: '#475569',
    fontWeight: 'bold',
  },
  nextBtn: {
    backgroundColor: '#0080FF',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#10B981',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  
  // Search & Filter UI
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearSearchIcon: {
    padding: 4,
  },
  filterToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleBtnActive: {
    backgroundColor: '#0080FF',
    borderColor: '#0080FF',
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
  horizontalChips: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0080FF',
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#0080FF',
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
});

export default ApproveDrones;
