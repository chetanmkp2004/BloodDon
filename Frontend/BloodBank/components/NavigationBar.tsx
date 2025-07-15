import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

const { width } = Dimensions.get('window');

interface NavigationBarProps {
  activeRoute?: string;
}

export default function NavigationBar({ activeRoute }: NavigationBarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      id: 'dashboard',
      icon: 'home',
      activeIcon: 'home',
      route: '/dashboard',
      label: 'Home'
    },
    {
      id: 'donate',
      icon: 'heart-outline',
      activeIcon: 'heart',
      route: '/donate',
      label: 'Donate'
    },
    {
      id: 'history',
      icon: 'time-outline',
      activeIcon: 'time',
      route: '/history',
      label: 'History'
    },
    {
      id: 'emergency',
      icon: 'alert-circle-outline',
      activeIcon: 'alert-circle',
      route: '/emergency',
      label: 'Emergency'
    },
    {
      id: 'profile',
      icon: 'person-outline',
      activeIcon: 'person',
      route: '/profile',
      label: 'Profile'
    }
  ];

  const handleNavigation = (route: string) => {
    if (pathname !== route) {
      router.push(route as any);
    }
  };

  const isActive = (route: string) => {
    return pathname === route || activeRoute === route;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        {navigationItems.map((item) => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
                <Ionicons
                  name={active ? item.activeIcon as any : item.icon as any}
                  size={24}
                  color={active ? '#FFFFFF' : '#64748B'}
                />
              </View>
              {active && <View style={styles.activeIndicator} />}
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    paddingBottom: 34, // Safe area for iPhone
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    position: 'relative',
    minWidth: 56,
  },
  navItemActive: {
    // Active state handled by iconContainerActive
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: '#DC143C',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC143C',
  },
});
