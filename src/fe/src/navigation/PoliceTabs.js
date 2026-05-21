import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PoliceDashboard from '../screens/police/PoliceDashboard';
import ZonesMap from '../screens/police/ZonesMap';
import ApproveDrones from '../screens/admin/ApproveDrones';
import ApproveFlightPermits from '../screens/police/ApproveFlightPermits';
import Profile from '../screens/police/Profile';

const Tab = createBottomTabNavigator();

const PoliceTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.02,
          shadowRadius: 10,
          elevation: 6,
        },
        tabBarActiveTintColor: '#0080FF',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = 'grid-outline';
          } else if (route.name === 'ZonesMap') {
            iconName = 'map-outline';
          } else if (route.name === 'Permits') {
            iconName = 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={PoliceDashboard} />
      <Tab.Screen name="ZonesMap" component={ZonesMap} />
      <Tab.Screen
        name="Registrations"
        component={ApproveDrones}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.customScannerWrapper}
              activeOpacity={0.85}
            >
              <View style={styles.customScannerBtn}>
                <Ionicons name="checkmark-circle" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Permits" component={ApproveFlightPermits} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customScannerWrapper: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customScannerBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0080FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default PoliceTabs;
