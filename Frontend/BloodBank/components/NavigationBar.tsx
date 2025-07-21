import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const ROUTES: {
  path: string;
  label: string;
  icon: 'home' | 'heart' | 'time' | 'alert-circle' | 'person';
}[] = [
  { path: '/dashboard', label: 'Home', icon: 'home' },
  { path: '/donate', label: 'Donate', icon: 'heart' },
  { path: '/history', label: 'History', icon: 'time' },
  { path: '/emergency', label: 'Emergency', icon: 'alert-circle' },
  { path: '/profile', label: 'Profile', icon: 'person' },
];

interface NavigationBarProps {
  activeRoute: string;
}

export default function NavigationBar({ activeRoute }: NavigationBarProps) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const currentTab = activeRoute || pathname;
  
  // Animation values for each tab
  const tabAnimations = useRef(
    ROUTES.map(() => new Animated.Value(0))
  ).current;
  
  // Floating animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Find active tab index
    const activeIndex = ROUTES.findIndex(route => route.path === currentTab);
    if (activeIndex !== -1) {
      // Animate all tabs to normal state except active tab
      tabAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: index === activeIndex ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
    
    // Start floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [currentTab]);

  const handlePress = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Animated.View 
        style={[
          styles.navBackground,
          {
            transform: [
              { translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -3]
              }) }
            ]
          }
        ]}
      >
        <View style={styles.navContent}>
          {ROUTES.map((route, index) => {
            const isActive = route.path === currentTab;
            
            return (
              <Link
                key={route.path}
                href={route.path as any}
                asChild
              >
                <TouchableOpacity 
                  style={styles.tabButton}
                  activeOpacity={0.7}
                  onPress={() => handlePress(index)}
                >
                  <Animated.View 
                    style={[
                      styles.tabContainer,
                      {
                        transform: [
                          { translateY: tabAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -8]
                          }) }
                        ]
                      }
                    ]}
                  >
                    <Animated.View 
                      style={[
                        styles.iconContainer,
                        isActive && styles.activeIconContainer,
                        {
                          transform: [
                            { scale: tabAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.15]
                            }) }
                          ]
                        }
                      ]}
                    >
                      <Ionicons 
                        name={
                          isActive
                            ? route.icon
                            : (route.icon + '-outline') as
                                | 'home-outline'
                                | 'heart-outline'
                                | 'time-outline'
                                | 'alert-circle-outline'
                                | 'person-outline'
                        }
                        size={22} 
                        color={isActive ? '#FFFFFF' : '#64748B'} 
                      />
                    </Animated.View>
                    
                    <Animated.Text 
                      style={[
                        styles.tabLabel,
                        isActive && styles.activeTabLabel,
                        { opacity: tabAnimations[index] }
                      ]}
                    >
                      {route.label}
                    </Animated.Text>
                  </Animated.View>
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  navBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: '#DC143C',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#DC143C',
    fontWeight: '700',
  },
});