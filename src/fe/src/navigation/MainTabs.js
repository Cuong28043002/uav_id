import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import UserDashboard from '../screens/user/UserDashboard';
import MyDrones from '../screens/user/MyDrones';
import RegisterDrone from '../screens/user/RegisterDrone';
import FlightLogs from '../screens/user/FlightLogs';
import Profile from '../screens/user/Profile';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
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
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Drones') {
            iconName = 'airplane-outline';
          } else if (route.name === 'FlightLogs') {
            iconName = 'journal-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={UserDashboard} />
      <Tab.Screen name="Drones" component={MyDrones} />
      <Tab.Screen
        name="RegisterDrone"
        component={RegisterDrone}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.customAddWrapper}
              activeOpacity={0.85}
            >
              <View style={styles.customAddBtn}>
                <Ionicons name="add" size={32} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="FlightLogs" component={FlightLogs} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customAddWrapper: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAddBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0080FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0080FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default MainTabs;
