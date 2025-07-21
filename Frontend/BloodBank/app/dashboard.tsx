import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  RefreshControl,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../components/NavigationBar';
import { PieChart } from 'react-native-chart-kit';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator } from 'react-native';
import { SharedElement } from 'react-native-shared-element';

const { width, height } = Dimensions.get('window');

interface DashboardStats {
  totalDonations: number;
  lastDonation: string;
  nextEligible: string;
  bloodType: string;
  impactScore: number;
  donationsThisYear: number;
  livesImpacted: number;
}

export default function DashboardScreen() {
  const { user, logout, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 5,
    lastDonation: '2025-06-15',
    nextEligible: '2025-08-10',
    bloodType: 'O+',
    impactScore: 78,
    donationsThisYear: 3,
    livesImpacted: 15,
  });

  // Animation values
  const headerScaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const statsScaleAnim = useRef(new Animated.Value(0.9)).current;
  const impactProgressAnim = useRef(new Animated.Value(0)).current;
  const heartbeatAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check authentication
    if (!loading && !user) {
      router.replace('/login');
    }

    // Start animations
    Animated.parallel([
      Animated.spring(headerScaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(statsScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
        delay: 300,
      }),
      Animated.timing(impactProgressAnim, {
        toValue: stats.impactScore / 100,
        duration: 1500,
        useNativeDriver: false,
        delay: 500,
      }),
    ]).start();

    // Start heartbeat animation
    startHeartbeatAnimation();
  }, [user, loading]);

  const startHeartbeatAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartbeatAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ])
    ).start();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            await logout();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const handleActionPress = (action: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert('Feature Coming Soon', `${action} will be available soon!`);
  };

  const quickActions = [
    {
      id: 'donate',
      title: 'Schedule Donation',
      subtitle: 'Book an appointment',
      icon: 'heart',
      color: '#DC143C',
      onPress: () => handleActionPress('Donation scheduling'),
    },
    {
      id: 'history',
      title: 'Donation History',
      subtitle: 'View past donations',
      icon: 'time',
      color: '#1E40AF',
      onPress: () => router.push('/history'),
    },
    {
      id: 'emergency',
      title: 'Emergency Request',
      subtitle: 'Urgent blood needed',
      icon: 'alert-circle',
      color: '#DC143C',
      onPress: () => router.push('/emergency'),
    },
    {
      id: 'rewards',
      title: 'Rewards & Badges',
      subtitle: 'Track achievements',
      icon: 'trophy',
      color: '#B91C1C',
      onPress: () => handleActionPress('Rewards system'),
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingAnimation}>
          <ActivityIndicator size="large" color="#DC143C" />
        </View>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  // Chart data for blood donation types
  const chartData = [
    { name: 'Whole Blood', count: 3, color: '#DC2626' },
    { name: 'Plasma', count: 1, color: '#FBBF24' },
    { name: 'Platelets', count: 1, color: '#3B82F6' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Professional Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ scale: headerScaleAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <SharedElement id="user-avatar" onNode={() => {}}>
                  <LinearGradient
                    colors={['#DC143C', '#B91C1C']}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </Text>
                  </LinearGradient>
                </SharedElement>
                <View style={styles.statusIndicator}>
                  <View style={styles.onlineStatus} />
                </View>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={styles.userName}>
                  {(() => {
                    const first = user?.first_name?.trim();
                    const last = user?.last_name?.trim();
                    if (first || last) return `${first || ''}${last ? ' ' + last : ''}`.trim();
                    const nested = user?.user;
                    const nFirst = nested?.first_name?.trim();
                    const nLast = nested?.last_name?.trim();
                    if (nFirst || nLast) return `${nFirst || ''}${nLast ? ' ' + nLast : ''}`.trim();
                    return user?.username || nested?.username || 'User';
                  })()}
                </Text>
                <View style={styles.donorBadge}>
                  <Ionicons name="shield-checkmark" size={14} color="#059669" />
                  <Text style={styles.donorBadgeText}>Verified Donor</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.logoutIcon}>
                <Ionicons name="log-out-outline" size={20} color="#64748B" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#DC143C']}
            tintColor="#DC143C"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trust Badge */}
        <Animated.View 
          style={[
            styles.trustBadge,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                }) }
              ]
            }
          ]}
        >
          <View style={styles.trustIcon}>
            <Ionicons name="shield-checkmark" size={18} color="#059669" />
          </View>
          <Text style={styles.trustText}>
            Secure • Verified Medical Platform • HIPAA Compliant
          </Text>
        </Animated.View>

        {/* Impact Score Card */}
        <Animated.View
          style={[
            styles.impactCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: statsScaleAnim }]
            }
          ]}
        >
          <View style={styles.impactHeader}>
            <Text style={styles.impactTitle}>Your Impact Score</Text>
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => Alert.alert('Impact Score', 'Your impact score is calculated based on frequency of donations, consistency, and lives impacted.')}
            >
              <Ionicons name="information-circle-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.impactContent}>
            <View style={styles.impactScoreContainer}>
              <View style={styles.progressRingContainer}>
                <Svg width={120} height={120} viewBox="0 0 100 100">
                  {/* Background circle */}
                  <Circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <AnimatedCircle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#DC2626"
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={impactProgressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2 * Math.PI * 45, 0]
                    })}
                    rotation="-90"
                    origin="50, 50"
                  />
                </Svg>
                <Text style={styles.impactScoreText}>{stats.impactScore}</Text>
              </View>
            </View>
            
            <View style={styles.impactStatsContainer}>
              <View style={styles.impactStat}>
                <Animated.View 
                  style={[
                    styles.impactStatIcon, 
                    styles.heartIcon,
                    {
                      transform: [{ scale: heartbeatAnim }]
                    }
                  ]}
                >
                  <Ionicons name="heart" size={20} color="#DC2626" />
                </Animated.View>
                <Text style={styles.impactStatNumber}>{stats.livesImpacted}</Text>
                <Text style={styles.impactStatLabel}>Lives Impacted</Text>
              </View>
              
              <View style={styles.impactStat}>
                <View style={[styles.impactStatIcon, styles.donationIcon]}>
                  <Ionicons name="water" size={20} color="#1E40AF" />
                </View>
                <Text style={styles.impactStatNumber}>{stats.donationsThisYear}</Text>
                <Text style={styles.impactStatLabel}>This Year</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Medical Stats Cards */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: statsScaleAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Your Medical Profile</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="heart" size={24} color="#DC143C" />
              </View>
              <AnimatedNumber 
                value={stats.totalDonations} 
                style={styles.statNumber}
              />
              <Text style={styles.statLabel}>Total Donations</Text>
              <Text style={styles.statSubLabel}>Lives Saved: {stats.totalDonations * 3}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="water" size={24} color="#1E40AF" />
              </View>
              <Text style={styles.statNumber}>{stats.bloodType}</Text>
              <Text style={styles.statLabel}>Blood Type</Text>
              <Text style={styles.statSubLabel}>Universal Donor</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="calendar" size={24} color="#059669" />
              </View>
              <Text style={styles.statNumber}>{formatDate(stats.lastDonation)}</Text>
              <Text style={styles.statLabel}>Last Donation</Text>
              <Text style={styles.statSubLabel}>Verified Safe</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="time" size={24} color="#D97706" />
              </View>
              <Text style={styles.statNumber}>{formatDate(stats.nextEligible)}</Text>
              <Text style={styles.statLabel}>Next Eligible</Text>
              <Text style={styles.statSubLabel}>Medical Guidelines</Text>
            </View>
          </View>
        </Animated.View>

        {/* Blood Donation Chart */}
        <Animated.View 
          style={[
            styles.chartContainer,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0, 0, 1]
              }),
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 0.7, 1],
                    outputRange: [40, 40, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Donation Breakdown</Text>
          
          <View style={styles.chartCard}>
            <PieChart
              data={chartData}
              width={width - 80}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
              hasLegend={false}
            />
            
            <View style={styles.chartLegend}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.name} ({item.count})</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Medical Quick Actions */}
        <Animated.View 
          style={[
            styles.actionsContainer,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0, 0, 1]
              }),
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [40, 40, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Medical Services</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <Animated.View 
                  style={[
                    styles.actionIcon, 
                    { 
                      backgroundColor: `${action.color}15`,
                      transform: [
                        { 
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 0.8 + index * 0.05, 1],
                            outputRange: [0.5, 0.5, 1]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <Ionicons name={action.icon as any} size={28} color={action.color} />
                </Animated.View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                <View style={styles.actionArrow}>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Medical Impact Banner */}
        <Animated.View 
          style={[
            styles.bannerContainer,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.9, 1],
                outputRange: [0, 0, 1]
              }),
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 0.9, 1],
                    outputRange: [30, 30, 0]
                  })
                }
              ]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.medicalBanner}
            activeOpacity={0.9}
            onPress={() => Alert.alert(
              'Medical Safety',
              'Our platform adheres to the highest medical standards for blood donation processing and delivery, ensuring optimal safety for both donors and recipients.'
            )}
          >
            <LinearGradient
              colors={['#DC143C', '#B91C1C']}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerContent}>
                <View style={styles.bannerIcon}>
                  <Ionicons name="medical" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.bannerText}>
                  <Text style={styles.bannerTitle}>Saving Lives Together</Text>
                  <Text style={styles.bannerSubtitle}>
                    Every donation undergoes rigorous medical testing to ensure safety and compatibility
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Medical Alerts */}
        <Animated.View 
          style={[
            styles.emergencyContainer,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.95, 1],
                outputRange: [0, 0, 1]
              }),
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 0.95, 1],
                    outputRange: [20, 20, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Medical Alerts</Text>
          
          <TouchableOpacity 
            style={styles.alertCard}
            activeOpacity={0.95}
            onPress={() => router.push('/emergency')}
          >
            <View style={styles.alertHeader}>
              <View style={styles.alertIcon}>
                <Ionicons name="medical" size={20} color="#DC143C" />
              </View>
              <Text style={styles.alertTitle}>Critical: O- Blood Shortage</Text>
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            </View>
            <Text style={styles.alertText}>
              Local medical facilities report critical shortage of O-negative blood. 
              FDA-approved donation centers available 24/7.
            </Text>
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }
                router.push('/donate');
              }}
            >
              <LinearGradient
                colors={['#DC143C', '#B91C1C']}
                style={styles.alertButtonGradient}
              >
                <Ionicons name="heart" size={16} color="#FFFFFF" style={styles.alertButtonIcon} />
                <Text style={styles.alertButtonText}>Donate Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>

        {/* Medical Safety Information */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              }),
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Safety & Compliance</Text>
          
          <View style={styles.statCard}>
            <View style={styles.safetyHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#059669" />
              <Text style={styles.safetyTitle}>Medical Standards Certified</Text>
            </View>
            <View style={styles.safetyItems}>
              <View style={styles.safetyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.safetyItemText}>FDA Approved Procedures</Text>
              </View>
              <View style={styles.safetyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.safetyItemText}>HIPAA Privacy Protection</Text>
              </View>
              <View style={styles.safetyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.safetyItemText}>24/7 Medical Monitoring</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Navigation Bar */}
      <NavigationBar activeRoute="/dashboard" />
    </View>
  );
}

// Animated Circle for progress
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Animated Number component
interface AnimatedNumberProps {
  value: number;
  style?: any;
}

function AnimatedNumber({ value, style }: AnimatedNumberProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    const listenerId = animatedValue.addListener((state) => {
      setDisplayValue(Math.floor(state.value));
    });

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [value]);

  return <Text style={style}>{displayValue}</Text>;
}

// Format date function
function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 150,
    height: 150,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 16,
  },
  header: {
    paddingTop: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerGradient: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  onlineStatus: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#059669',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: '400',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  donorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  donorBadgeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 4,
  },
  logoutButton: {
    padding: 8,
  },
  logoutIcon: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  trustIcon: {
    marginRight: 8,
  },
  trustText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    textAlign: 'center',
  },
  // --- Added missing styles below ---
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  safetyItems: {
    marginTop: 8,
    marginBottom: 4,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  safetyItemText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    fontWeight: '400',
  },
  bottomSpacing: {
    height: 32,
  },
  impactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  impactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  infoButton: {
    padding: 4,
  },
  impactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactScoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactScoreText: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
  },
  impactStatsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: 16,
  },
  impactStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  impactStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heartIcon: {
    backgroundColor: '#FEF2F2',
  },
  donationIcon: {
    backgroundColor: '#EFF6FF',
  },
  impactStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 8,
  },
  impactStatLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statSubLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '400',
  },
  chartContainer: {
    marginBottom: 32,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '400',
  },
  actionArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bannerContainer: {
    marginBottom: 32,
  },
  medicalBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  bannerGradient: {
    padding: 24,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    marginRight: 16,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FCA5A5',
    lineHeight: 20,
    fontWeight: '400',
  },
  emergencyContainer: {
    marginBottom: 32,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#DC143C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: '#DC143C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  alertText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    fontWeight: '400',
    lineHeight: 20,
  },
  alertButton: {
    marginTop: 12,
  },
  alertButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  alertButtonIcon: {
    marginRight: 8,
  },
  alertButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});