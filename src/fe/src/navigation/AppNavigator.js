import React, { useState, useEffect, createContext, useContext } from 'react';
import { ActivityIndicator, View, StyleSheet, Alert as RNAlert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPassword from '../screens/auth/ForgotPassword';

import UserTabs from './UserTabs';
import PoliceTabs from './PoliceTabs';
import AdminTabs from './AdminTabs';

import SearchDrones from '../screens/police/SearchDrones';
import ReportViolation from '../screens/police/ReportViolation';
import InspectionScreen from '../screens/police/InspectionScreen';
import QRScanner from '../screens/police/QRScanner';

import RegisterDrone from '../screens/user/RegisterDrone';
import RequestFlight from '../screens/user/RequestFlight';
import FlightLogs from '../screens/user/FlightLogs';
import MyViolations from '../screens/user/MyViolations';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import LiveFlight from '../screens/user/LiveFlight';

// Shared Detail Screens
import DroneDetail from '../screens/shared/DroneDetail';
import ViolationDetail from '../screens/shared/ViolationDetail';
import FlightPermitDetail from '../screens/shared/FlightPermitDetail';
import SystemViolations from '../screens/shared/SystemViolations';
import ApproveDrones from '../screens/admin/ApproveDrones';
import SystemSettings from '../screens/admin/SystemSettings';

// Custom Alert
import CustomAlertHelper, { CustomAlert } from '../components/CustomAlert';

// Override global React Native Alert with CustomAlert
RNAlert.alert = CustomAlertHelper.alert;

const Stack = createStackNavigator();
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const checkAuth = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (userStr && token) {
        const user = JSON.parse(userStr);
        const role = typeof user.role === 'object' ? user.role?.name : user.role;
        setUserRole(role ? role.toLowerCase() : null);
      } else {
        setUserRole(null);
      }
    } catch (error) {
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0080FF" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, checkAuth }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userRole === null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          </>
        ) : (
          <>
            {userRole === 'admin' ? (
              <>
                <Stack.Screen name="AdminHome" component={AdminTabs} />
              </>
            ) : userRole === 'police' ? (
              <>
                <Stack.Screen name="PoliceHome" component={PoliceTabs} />
                <Stack.Screen name="SearchDrones" component={SearchDrones} />
                <Stack.Screen name="ReportViolation" component={ReportViolation} />
                <Stack.Screen name="InspectionScreen" component={InspectionScreen} />
                <Stack.Screen name="QRScanner" component={QRScanner} />
              </>
            ) : (
              <>
                <Stack.Screen name="UserHome" component={UserTabs} />
                <Stack.Screen name="RegisterDrone" component={RegisterDrone} />
                <Stack.Screen name="RequestFlight" component={RequestFlight} />
                <Stack.Screen name="FlightLogs" component={FlightLogs} />
                <Stack.Screen name="MyViolations" component={MyViolations} />
                <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
                <Stack.Screen name="LiveFlight" component={LiveFlight} />
              </>
            )}

            {/* Shared Detail Screens */}
            <Stack.Screen name="DroneDetail" component={DroneDetail} />
            <Stack.Screen name="ViolationDetail" component={ViolationDetail} />
            <Stack.Screen name="FlightPermitDetail" component={FlightPermitDetail} />
            <Stack.Screen name="SystemViolations" component={SystemViolations} />
            <Stack.Screen name="ApproveDrones" component={ApproveDrones} />
            <Stack.Screen name="SystemSettings" component={SystemSettings} />
          </>
        )}
      </Stack.Navigator>
      <CustomAlert />
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
