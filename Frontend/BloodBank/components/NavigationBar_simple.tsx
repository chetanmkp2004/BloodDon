import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

interface NavigationBarProps {
  activeRoute?: string;
}

export default function NavigationBar({ activeRoute }: NavigationBarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      id: 'dashboard',
      icon: 'home-outline',
      activeIcon: 'home',
      route: '/dashboard',
      label: 'Home',
    },
    {
      id: 'search',
      icon: 'search-outline',
      activeIcon: 'search',
      route: '/search-donors',
      label: 'Search',
    },
    {
      id: 'history',
      icon: 'time-outline',
      activeIcon: 'time',
      route: '/history',
      label: 'History',
    },
    {
      id: 'profile',
      icon: 'person-outline',
      activeIcon: 'person',
      route: '/profile',
      label: 'Profile',
    }
  ];

  const handleNavigation = (route: string) => {
    try {
      router.push(route as any);
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };

  const isActive = (route: string) => {
    if (activeRoute) {
      return activeRoute === route;
    }
    return pathname === route || pathname.includes(route.split('/').pop() || '');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        {navigationItems.map((item) => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                active && styles.iconContainerActive
              ]}>
                <Ionicons
                  name={active ? item.activeIcon as any : item.icon as any}
                  size={22}
                  color={active ? '#DC2626' : '#6B7280'}
                />
              </View>
              <Text style={[
                styles.label,
                active && styles.labelActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: 'transparent',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  iconContainer: {
    padding: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: '#FEE2E2',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  labelActive: {
    color: '#DC2626',
    fontWeight: '600',
  },
});
