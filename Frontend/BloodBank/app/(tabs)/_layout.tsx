import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../../components/NavigationBar';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' }, // Hide default tab bar
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="donate"
          options={{
            title: 'Donate',
            tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="emergency"
          options={{
            title: 'Emergency',
            tabBarIcon: ({ color }) => <Ionicons name="alert-circle" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
          }}
        />
      </Tabs>
      
      {/* Custom Navigation Bar */}
      <NavigationBar activeRoute="/(tabs)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative', // Ensure proper positioning context
  },
});