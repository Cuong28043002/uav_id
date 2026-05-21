import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DateTimePickerModal = ({ visible, onClose, onConfirm, title = "Chọn thời gian" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('date'); // 'date' | 'time'
  const [hours, setHours] = useState(selectedDate.getHours());
  const [minutes, setMinutes] = useState(Math.round(selectedDate.getMinutes() / 5) * 5 % 60);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.92));

  useEffect(() => {
    if (visible) {
      const now = new Date();
      // Mặc định chọn ngày hiện tại và làm tròn phút tới 5 phút gần nhất
      const roundedMinutes = Math.round(now.getMinutes() / 5) * 5;
      const initialDate = new Date();
      if (roundedMinutes >= 60) {
        initialDate.setHours(now.getHours() + 1);
        initialDate.setMinutes(0);
      } else {
        initialDate.setMinutes(roundedMinutes);
      }

      setSelectedDate(initialDate);
      setCurrentDate(initialDate);
      setHours(initialDate.getHours());
      setMinutes(initialDate.getMinutes());
      setActiveTab('date');

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [visible]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthsText = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);
  
  // T2=0, T3=1, T4=2, T5=3, T6=4, T7=5, CN=6
  const emptyDaysBefore = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const handleSelectDay = (day) => {
    const newSelected = new Date(selectedDate);
    newSelected.setFullYear(year);
    newSelected.setMonth(month);
    newSelected.setDate(day);
    setSelectedDate(newSelected);
  };

  const handleHourChange = (amount) => {
    let nextHour = hours + amount;
    if (nextHour < 0) nextHour = 23;
    if (nextHour > 23) nextHour = 0;
    setHours(nextHour);
  };

  const handleMinuteChange = (amount) => {
    let nextMin = minutes + amount;
    if (nextMin < 0) nextMin = 55;
    if (nextMin >= 60) nextMin = 0;
    setMinutes(nextMin);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleConfirm = () => {
    const finalDate = new Date(selectedDate);
    finalDate.setHours(hours);
    finalDate.setMinutes(minutes);
    finalDate.setSeconds(0);
    
    const pad = (n) => (n < 10 ? '0' + n : n);
    // Xuất ra định dạng ISO chuẩn: YYYY-MM-DDTHH:mm:00Z
    const formatted = `${finalDate.getFullYear()}-${pad(finalDate.getMonth() + 1)}-${pad(finalDate.getDate())}T${pad(finalDate.getHours())}:${pad(finalDate.getMinutes())}:00Z`;
    
    onConfirm(formatted);
    handleClose();
  };

  // Lấy danh sách các ô lịch
  const cells = [];
  for (let i = 0; i < emptyDaysBefore; i++) {
    cells.push({ key: `empty-${i}`, isCurrentMonth: false, dayNum: '' });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isSelected = selectedDate.getDate() === i && 
                       selectedDate.getMonth() === month && 
                       selectedDate.getFullYear() === year;
    cells.push({
      key: `day-${i}`,
      isCurrentMonth: true,
      dayNum: i,
      isSelected,
    });
  }

  // Chia danh sách ô thành các dòng (mỗi dòng 7 ngày)
  const rows = [];
  let currentRow = [];
  cells.forEach((cell, index) => {
    currentRow.push(cell);
    if (currentRow.length === 7 || index === cells.length - 1) {
      while (currentRow.length < 7) {
        currentRow.push({ key: `empty-tail-${currentRow.length}`, isCurrentMonth: false, dayNum: '' });
      }
      rows.push(currentRow);
      currentRow = [];
    }
  });

  const padNumber = (num) => num.toString().padStart(2, '0');

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.gradientBg}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Selected Info Display */}
            <View style={styles.displayArea}>
              <Text style={styles.displayDate}>
                {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
              </Text>
              <Text style={styles.displayTime}>
                {padNumber(hours)} : {padNumber(minutes)}
              </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'date' && styles.tabActive]}
                onPress={() => setActiveTab('date')}
              >
                <Ionicons name="calendar-outline" size={16} color={activeTab === 'date' ? '#0080FF' : '#64748B'} />
                <Text style={[styles.tabText, activeTab === 'date' && styles.tabTextActive]}>Chọn ngày</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'time' && styles.tabActive]}
                onPress={() => setActiveTab('time')}
              >
                <Ionicons name="time-outline" size={16} color={activeTab === 'time' ? '#0080FF' : '#64748B'} />
                <Text style={[styles.tabText, activeTab === 'time' && styles.tabTextActive]}>Chọn giờ</Text>
              </TouchableOpacity>
            </View>

            {/* Body Content */}
            <View style={styles.pickerBody}>
              {activeTab === 'date' ? (
                <View style={styles.calendarContainer}>
                  {/* Month / Year Navigator */}
                  <View style={styles.monthHeader}>
                    <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
                      <Ionicons name="chevron-back" size={18} color="#0080FF" />
                    </TouchableOpacity>
                    <Text style={styles.monthLabel}>{monthsText[month]}, {year}</Text>
                    <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
                      <Ionicons name="chevron-forward" size={18} color="#0080FF" />
                    </TouchableOpacity>
                  </View>

                  {/* Days of Week Header */}
                  <View style={styles.weekHeader}>
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, index) => (
                      <Text key={index} style={[styles.weekLabel, d === 'CN' && styles.sundayLabel]}>{d}</Text>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View style={styles.grid}>
                    {rows.map((row, rIdx) => (
                      <View key={rIdx} style={styles.gridRow}>
                        {row.map((cell) => {
                          if (!cell.isCurrentMonth) {
                            return <View key={cell.key} style={styles.dayCellEmpty} />;
                          }
                          return (
                            <TouchableOpacity
                              key={cell.key}
                              onPress={() => handleSelectDay(cell.dayNum)}
                              style={[
                                styles.dayCell,
                                cell.isSelected && styles.dayCellSelected
                              ]}
                            >
                              <Text
                                style={[
                                  styles.dayText,
                                  cell.isSelected && styles.dayTextSelected
                                ]}
                              >
                                {cell.dayNum}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.timePickerContainer}>
                  <View style={styles.timeAdjusterRow}>
                    {/* Hour Column */}
                    <View style={styles.timeCol}>
                      <Text style={styles.timeColLabel}>GIỜ</Text>
                      <TouchableOpacity onPress={() => handleHourChange(1)} style={styles.adjustBtn}>
                        <Ionicons name="chevron-up" size={24} color="#0080FF" />
                      </TouchableOpacity>
                      <View style={styles.timeValueBox}>
                        <Text style={styles.timeValue}>{padNumber(hours)}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleHourChange(-1)} style={styles.adjustBtn}>
                        <Ionicons name="chevron-down" size={24} color="#0080FF" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.timeDivider}>:</Text>

                    {/* Minute Column */}
                    <View style={styles.timeCol}>
                      <Text style={styles.timeColLabel}>PHÚT</Text>
                      <TouchableOpacity onPress={() => handleMinuteChange(5)} style={styles.adjustBtn}>
                        <Ionicons name="chevron-up" size={24} color="#0080FF" />
                      </TouchableOpacity>
                      <View style={styles.timeValueBox}>
                        <Text style={styles.timeValue}>{padNumber(minutes)}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleMinuteChange(-5)} style={styles.adjustBtn}>
                        <Ionicons name="chevron-down" size={24} color="#0080FF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={handleClose} style={[styles.footerBtn, styles.cancelBtn]}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={[styles.footerBtn, styles.confirmBtn]}>
                <Text style={styles.confirmBtnText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  gradientBg: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  displayArea: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  displayDate: {
    fontSize: 13,
    color: '#0080FF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  displayTime: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0080FF',
    marginTop: 4,
    letterSpacing: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 9,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0080FF',
  },
  pickerBody: {
    minHeight: 250,
    justifyContent: 'center',
  },
  calendarContainer: {
    flex: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navBtn: {
    padding: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekLabel: {
    width: 38,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  sundayLabel: {
    color: '#EF4444',
  },
  grid: {
    gap: 6,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
  },
  dayCellEmpty: {
    width: 38,
    height: 38,
  },
  dayCellSelected: {
    backgroundColor: '#0080FF',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeAdjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  timeCol: {
    alignItems: 'center',
    width: 70,
  },
  timeColLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 6,
    letterSpacing: 1,
  },
  adjustBtn: {
    padding: 6,
  },
  timeValueBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  timeValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  timeDivider: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64748B',
    top: 10,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  footerBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: '#0080FF',
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DateTimePickerModal;
