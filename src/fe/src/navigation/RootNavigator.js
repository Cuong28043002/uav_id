import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPassword from '../screens/auth/ForgotPassword';

import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageUsers from '../screens/admin/ManageUsers';
import ApproveDrones from '../screens/admin/ApproveDrones';
import SystemSettings from '../screens/admin/SystemSettings';

import PoliceDashboard from '../screens/police/PoliceDashboard';
import SearchDrones from '../screens/police/SearchDrones';
import ReportViolation from '../screens/police/ReportViolation';
import InspectionScreen from '../screens/police/InspectionScreen';

import UserDashboard from '../screens/user/UserDashboard';
import MyDrones from '../screens/user/MyDrones';
import RegisterDrone from '../screens/user/RegisterDrone';
import RequestFlight from '../screens/user/RequestFlight';
import FlightLogs from '../screens/user/FlightLogs';
import MyViolations from '../screens/user/MyViolations';
import NotificationsScreen from '../screens/user/NotificationsScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F8F9FA' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="ManageUsers" component={ManageUsers} />
      <Stack.Screen name="ApproveDrones" component={ApproveDrones} />
      <Stack.Screen name="SystemSettings" component={SystemSettings} />

      <Stack.Screen name="PoliceDashboard" component={PoliceDashboard} />
      <Stack.Screen name="SearchDrones" component={SearchDrones} />
      <Stack.Screen name="ReportViolation" component={ReportViolation} />
      <Stack.Screen name="InspectionScreen" component={InspectionScreen} />

      <Stack.Screen name="UserDashboard" component={UserDashboard} />
      <Stack.Screen name="MyDrones" component={MyDrones} />
      <Stack.Screen name="RegisterDrone" component={RegisterDrone} />
      <Stack.Screen name="RequestFlight" component={RequestFlight} />
      <Stack.Screen name="FlightLogs" component={FlightLogs} />
      <Stack.Screen name="MyViolations" component={MyViolations} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
