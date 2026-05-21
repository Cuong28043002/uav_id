import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

let alertInstance = null;

const CustomAlert = () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttons, setButtons] = useState([]);
  const [type, setType] = useState('info'); // 'success', 'error', 'warning', 'info'
  const [scale] = useState(new Animated.Value(0.9));
  const [fade] = useState(new Animated.Value(0));

  useEffect(() => {
    alertInstance = {
      show: (t, msg, bts, alertType = 'info') => {
        setTitle(t);
        setMessage(msg);
        setButtons(bts || []);
        setType(alertType);
        setVisible(true);
        
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          })
        ]).start();
      },
      hide: () => {
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 150,
            useNativeDriver: true,
          })
        ]).start(() => {
          setVisible(false);
        });
      }
    };

    return () => {
      alertInstance = null;
    };
  }, []);

  if (!visible) return null;

  const handleButtonPress = (onPress) => {
    if (alertInstance) {
      alertInstance.hide();
    }
    setTimeout(() => {
      if (onPress) onPress();
    }, 160);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="checkmark-circle" size={40} color="#10B981" />
          </View>
        );
      case 'error':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="alert-circle" size={40} color="#EF4444" />
          </View>
        );
      case 'warning':
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="warning" size={40} color="#F59E0B" />
          </View>
        );
      default:
        return (
          <View style={[styles.iconWrapper, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="information-circle" size={40} color="#0080FF" />
          </View>
        );
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fade }]} />
        <Animated.View style={[styles.alertBox, { transform: [{ scale }], opacity: fade }]}>
          {getIcon()}
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
          
          <View style={[styles.buttonContainer, buttons.length > 2 && styles.buttonContainerVertical]}>
            {buttons.length === 0 ? (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                activeOpacity={0.8}
                onPress={() => handleButtonPress()}
              >
                <Text style={styles.primaryButtonText}>Đồng ý</Text>
              </TouchableOpacity>
            ) : (
              buttons.map((btn, idx) => {
                const isCancel = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    style={[
                      styles.button,
                      buttons.length > 2 ? styles.buttonVertical : styles.buttonHorizontal,
                      isCancel
                        ? styles.cancelButton
                        : isDestructive
                        ? styles.destructiveButton
                        : styles.primaryButton,
                    ]}
                    onPress={() => handleButtonPress(btn.onPress)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isCancel ? styles.cancelButtonText : styles.primaryButtonText,
                      ]}
                    >
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Alert = {
  alert: (title, message, buttons, options) => {
    let type = 'info';
    const lowerTitle = (title || '').toLowerCase();
    const lowerMessage = (message || '').toLowerCase();

    if (
      lowerTitle.includes('thành công') ||
      lowerMessage.includes('thành công') ||
      lowerMessage.includes('đã lưu') ||
      lowerMessage.includes('đã gửi') ||
      lowerMessage.includes('đã duyệt') ||
      lowerMessage.includes('hợp lệ')
    ) {
      type = 'success';
    } else if (
      lowerTitle.includes('lỗi') ||
      lowerTitle.includes('thất bại') ||
      lowerMessage.includes('lỗi') ||
      lowerMessage.includes('thất bại') ||
      lowerMessage.includes('không thể') ||
      lowerMessage.includes('cảnh báo') ||
      lowerMessage.includes('sai mật khẩu') ||
      lowerMessage.includes('chưa xác định')
    ) {
      type = 'error';
    } else if (
      lowerTitle.includes('xác nhận') ||
      lowerMessage.includes('xác nhận') ||
      lowerMessage.includes('chắc chắn') ||
      lowerMessage.includes('thu hồi') ||
      lowerMessage.includes('từ chối') ||
      lowerMessage.includes('khóa')
    ) {
      type = 'warning';
    }

    if (alertInstance) {
      alertInstance.show(title, message, buttons, type);
    } else {
      console.warn('CustomAlert instance not mounted. Falling back to default Alert.');
      // Import react-native dynamically to bypass circular dependency if any
      const { Alert: RNAlert } = require('react-native');
      RNAlert.alert(title, message, buttons, options);
    }
  },
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Dark blue-grey overlay
  },
  alertBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: Math.min(width - 48, 340),
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  buttonContainerVertical: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonHorizontal: {
    flex: 1,
  },
  buttonVertical: {
    width: '100%',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#0080FF',
    borderColor: '#0080FF',
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});

export { CustomAlert };
export default Alert;
