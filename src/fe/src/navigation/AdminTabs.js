import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AdminDashboard from '../screens/admin/AdminDashboard';
import ApproveDrones from '../screens/admin/ApproveDrones';
import ManageUsers from '../screens/admin/ManageUsers';
import SystemSettings from '../screens/admin/SystemSettings';
import Profile from '../screens/user/Profile';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7E9',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarActiveTintColor: '#0080FF',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = 'grid-outline';
          } else if (route.name === 'Users') {
            iconName = 'people-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Users" component={ManageUsers} />
      <Tab.Screen
        name="Registrations"
        component={ApproveDrones}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.customCenterWrapper}
              activeOpacity={0.85}
            >
              <View style={styles.customCenterBtn}>
                <Ionicons name="checkmark-circle" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Settings" component={SystemSettings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customCenterWrapper: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCenterBtn: {
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

export default AdminTabs;
