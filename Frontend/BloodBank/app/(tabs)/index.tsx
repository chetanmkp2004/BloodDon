import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  RefreshControl,
  Image,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withSpring,
  withTiming,
  withDelay,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  BounceIn,
  ZoomIn,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../src/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ApiService from '../../src/api';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 280;
const HEADER_HEIGHT_COLLAPSED = 80;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface StatModalData {
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
}

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    livesImpacted: 0,
    nextDonation: null as string | null,
    bloodType: '',
  });
  const [nearbyRequests, setNearbyRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [donationHistory, setDonationHistory] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  
  // Modal states
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState<StatModalData | null>(null);
  
  // Animation values
  const cardScale = useSharedValue(1);
  const pulseAnim = useSharedValue(1);
  const emergencyPulse = useSharedValue(1);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load donation history
      try {
        const history = await ApiService.getDonationHistory();
        setDonationHistory(history || []);
        
        // Calculate stats from history
        const totalDonations = history?.length || 0;
        const livesImpacted = totalDonations * 3; // Estimate 3 lives per donation
        
        setStats(prev => ({
          ...prev,
          totalDonations,
          livesImpacted,
          bloodType: user?.blood_type || user?.user?.blood_type || 'Unknown',
          nextDonation: totalDonations > 0 ? '2025-08-15' : null
        }));
      } catch (error) {
        console.error('Error loading donation history:', error);
        // Set default values if API fails
        setStats(prev => ({
          ...prev,
          totalDonations: 0,
          livesImpacted: 0,
          bloodType: user?.blood_type || user?.user?.blood_type || 'Unknown',
          nextDonation: null
        }));
      }
      
      // Load emergency requests
      try {
        const requests = await ApiService.getEmergencyRequests();
        setEmergencyRequests(requests || []);
        setNearbyRequests(requests?.length || 0);
      } catch (error) {
        console.error('Error loading emergency requests:', error);
        setNearbyRequests(0);
      }
      
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Start continuous animations
    const startPulseAnimation = () => {
      pulseAnim.value = withTiming(1.05, { duration: 1000 }, () => {
        pulseAnim.value = withTiming(1, { duration: 1000 }, () => {
          runOnJS(startPulseAnimation)();
        });
      });
    };
    
    const startEmergencyPulse = () => {
      emergencyPulse.value = withTiming(1.02, { duration: 800 }, () => {
        emergencyPulse.value = withTiming(1, { duration: 800 }, () => {
          runOnJS(startEmergencyPulse)();
        });
      });
    };
    
    startPulseAnimation();
    startEmergencyPulse();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED],
      [HEADER_HEIGHT, HEADER_HEIGHT_COLLAPSED],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, (HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED) / 2, HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    const blurOpacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      height,
      opacity,
      blurOpacity,
    };
  });

  const headerTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [(HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED) * 0.7, HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED],
      [0, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [(HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED) * 0.7, HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED],
      [30, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const contentTranslateY = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT - HEADER_HEIGHT_COLLAPSED],
      [0, -20],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={StyleSheet.absoluteFill}
        />
        <Image 
          source={require('../../assets/images/icon.png')} 
          style={styles.loadingLogo} 
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#E11D48" style={styles.spinner} />
        <Text style={styles.loadingText}>Loading your dashboard</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <LinearGradient
          colors={['#E11D48', '#9F1239']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Blob decorations */}
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
        
        {/* Header content */}
        <View style={styles.headerContent}>
          <Animated.View style={[styles.userInfoContainer, { opacity: headerAnimatedStyle.opacity }]}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </Text>
              </LinearGradient>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome back,Chetan</Text>
              <Text style={styles.userName}>
                {(() => {
                  // Prefer top-level first/last name
                  const first = user?.first_name?.trim();
                  const last = user?.last_name?.trim();
                  if (first || last) return `${first || ''}${last ? ' ' + last : ''}`.trim();
                  // Fallback to nested user object
                  const nested = user?.user;
                  const nFirst = nested?.first_name?.trim();
                  const nLast = nested?.last_name?.trim();
                  if (nFirst || nLast) return `${nFirst || ''}${nLast ? ' ' + nLast : ''}`.trim();
                  // Fallback to username
                  return user?.username || nested?.username || 'User';
                })()}
              </Text>
              
              <View style={styles.badgeContainer}>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
                  <Text style={styles.verifiedText}>Verified Donor</Text>
                </View>
              </View>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.headerTitleContainer, headerTitleStyle]}>
            <Text style={styles.headerTitle}>BloodBank</Text>
          </Animated.View>

          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <AnimatedScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#E11D48"
            colors={['#E11D48']}
          />
        }
      >
        <Animated.View style={[styles.contentContainer, contentTranslateY]}>
          {/* Enhanced Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <Animated.View entering={FadeIn.delay(100).duration(600)}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => router.push('/donate')}
                  activeOpacity={0.8}
                  onPressIn={() => {
                    cardScale.value = withSpring(0.95);
                  }}
                  onPressOut={() => {
                    cardScale.value = withSpring(1);
                  }}
                >
                  <Animated.View style={[styles.quickActionContent, {
                    transform: [{ scale: cardScale }]
                  }]}>
                    <LinearGradient
                      colors={['#FF6B9D', '#EC4899']}
                      style={styles.quickActionIconContainer}
                    >
                      <Ionicons name="heart" size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={styles.quickActionTitle}>Donate Blood</Text>
                    <Text style={styles.quickActionSubtitle}>Save lives today</Text>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View entering={FadeIn.delay(200).duration(600)}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => setShowEmergencyModal(true)}
                  activeOpacity={0.8}
                >
                  <Animated.View style={[styles.quickActionContent, {
                    transform: [{ scale: emergencyPulse }]
                  }]}>
                    <LinearGradient
                      colors={['#FF5722', '#D32F2F']}
                      style={styles.quickActionIconContainer}
                    >
                      <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={styles.quickActionTitle}>Emergency</Text>
                    <Text style={styles.quickActionSubtitle}>{nearbyRequests} urgent requests</Text>
                    {nearbyRequests > 0 && (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentBadgeText}>URGENT</Text>
                      </View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View entering={FadeIn.delay(300).duration(600)}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => router.push('/history')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4FC3F7', '#2196F3']}
                    style={styles.quickActionIconContainer}
                  >
                    <Ionicons name="time" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.quickActionTitle}>History</Text>
                  <Text style={styles.quickActionSubtitle}>View donations</Text>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View entering={FadeIn.delay(400).duration(600)}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => setShowProfileModal(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#AB47BC', '#8E24AA']}
                    style={styles.quickActionIconContainer}
                  >
                    <Ionicons name="person" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.quickActionTitle}>Profile</Text>
                  <Text style={styles.quickActionSubtitle}>Manage account</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          
          {/* Enhanced Donor Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Impact</Text>
            <View style={styles.statsGrid}>
              <Animated.View entering={SlideInDown.delay(100).duration(700)}>
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={() => {
                    setSelectedStat({
                      title: 'Blood Type',
                      value: stats.bloodType,
                      description: 'Your blood type determines compatibility',
                      icon: 'water',
                      color: '#E11D48'
                    });
                    setShowStatsModal(true);
                  }}
                  activeOpacity={0.9}
                >
                  <Animated.View style={[styles.statCardContent, {
                    transform: [{ scale: pulseAnim }]
                  }]}>
                    <View style={styles.statHeader}>
                      <Ionicons name="water" size={20} color="#E11D48" />
                      <Text style={styles.statLabel}>Blood Type</Text>
                    </View>
                    <Text style={styles.statValue}>{stats.bloodType}</Text>
                    <Text style={styles.statSubtext}>Universal Donor</Text>
                    <View style={styles.statIndicator} />
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View entering={SlideInDown.delay(200).duration(700)}>
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={() => {
                    setSelectedStat({
                      title: 'Next Eligible Date',
                      value: stats.nextDonation ? new Date(stats.nextDonation).toLocaleDateString() : 'Not scheduled',
                      description: 'When you can donate again safely',
                      icon: 'calendar',
                      color: '#059669'
                    });
                    setShowStatsModal(true);
                  }}
                  activeOpacity={0.9}
                >
                  <View style={styles.statHeader}>
                    <Ionicons name="calendar" size={20} color="#059669" />
                    <Text style={styles.statLabel}>Next Eligible</Text>
                  </View>
                  <Text style={styles.statValue}>
                    {stats.nextDonation ? new Date(stats.nextDonation).toLocaleDateString() : 'Ready now'}
                  </Text>
                  <Text style={styles.statSubtext}>Mark your calendar</Text>
                  <View style={styles.statIndicator} />
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View entering={SlideInDown.delay(300).duration(700)}>
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={() => {
                    setSelectedStat({
                      title: 'Total Donations',
                      value: stats.totalDonations.toString(),
                      description: `You've made ${stats.totalDonations} life-saving donations`,
                      icon: 'heart',
                      color: '#DC2626'
                    });
                    setShowStatsModal(true);
                  }}
                  activeOpacity={0.9}
                >
                  <View style={styles.statHeader}>
                    <Ionicons name="heart" size={20} color="#DC2626" />
                    <Text style={styles.statLabel}>Donations</Text>
                  </View>
                  <Text style={styles.statValue}>{stats.totalDonations}</Text>
                  <Text style={styles.statSubtext}>Thank you!</Text>
                  <View style={styles.statIndicator} />
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View entering={SlideInDown.delay(400).duration(700)}>
                <TouchableOpacity
                  style={styles.statCard}
                  onPress={() => {
                    setSelectedStat({
                      title: 'Lives Impacted',
                      value: stats.livesImpacted.toString(),
                      description: 'Estimated lives saved through your donations',
                      icon: 'people',
                      color: '#7C3AED'
                    });
                    setShowStatsModal(true);
                  }}
                  activeOpacity={0.9}
                >
                  <View style={styles.statHeader}>
                    <Ionicons name="people" size={20} color="#7C3AED" />
                    <Text style={styles.statLabel}>Lives Saved</Text>
                  </View>
                  <Text style={styles.statValue}>{stats.livesImpacted}</Text>
                  <Text style={styles.statSubtext}>Keep saving lives</Text>
                  <View style={styles.statIndicator} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          
          {/* Enhanced Emergency Banner */}
          <Animated.View 
            entering={SlideInDown.delay(500).duration(800)}
            style={styles.emergencyBannerContainer}
          >
            <TouchableOpacity 
              style={styles.emergencyBanner}
              onPress={() => setShowEmergencyModal(true)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FEE2E2', '#FEF2F2']}
                style={styles.emergencyBannerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Animated.View style={[styles.emergencyContent, {
                  transform: [{ scale: emergencyPulse }]
                }]}>
                  <View style={styles.emergencyIconContainer}>
                    <Ionicons name="alert-circle" size={32} color="#E11D48" />
                  </View>
                  <View style={styles.emergencyTextContainer}>
                    <Text style={styles.emergencyTitle}>Critical Blood Needed</Text>
                    <Text style={styles.emergencySubtext}>
                      {nearbyRequests} urgent requests near you
                    </Text>
                    <View style={styles.emergencyProgress}>
                      <View style={styles.emergencyProgressBar} />
                    </View>
                  </View>
                  <View style={styles.emergencyAction}>
                    <Ionicons name="chevron-forward" size={24} color="#E11D48" />
                  </View>
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Upcoming Appointment */}
          <View style={styles.appointmentContainer}>
            <Text style={styles.sectionTitle}>Next Appointment</Text>
            <TouchableOpacity
              style={styles.appointmentCard}
              activeOpacity={0.9}
            >
              <View style={styles.appointmentDateContainer}>
                <Text style={styles.appointmentMonth}>JUL</Text>
                <Text style={styles.appointmentDay}>28</Text>
                <Text style={styles.appointmentTime}>10:30 AM</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentTitle}>Blood Donation</Text>
                <Text style={styles.appointmentLocation}>City Blood Bank Center</Text>
                <View style={styles.appointmentStatus}>
                  <View style={styles.appointmentStatusDot} />
                  <Text style={styles.appointmentStatusText}>Confirmed</Text>
                </View>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.appointmentActionButton}>
                  <Ionicons name="calendar-outline" size={18} color="#E11D48" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.scheduleButton}>
              <Text style={styles.scheduleButtonText}>Schedule New Appointment</Text>
              <Ionicons name="add-circle" size={18} color="#E11D48" />
            </TouchableOpacity>
          </View>
          
          {/* Health Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Donor Health Tips</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tipsScrollContent}
            >
              <TouchableOpacity style={styles.tipCard} activeOpacity={0.9}>
                <Image 
                  source={require('../../assets/images/icon.png')} 
                  style={styles.tipImage} 
                  resizeMode="cover"
                />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Stay Hydrated</Text>
                  <Text style={styles.tipDescription}>
                    Drink extra water before and after donation.
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.tipCard} activeOpacity={0.9}>
                <Image 
                  source={require('../../assets/images/icon.png')} 
                  style={styles.tipImage} 
                  resizeMode="cover"
                />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Iron-Rich Foods</Text>
                  <Text style={styles.tipDescription}>
                    Maintain healthy iron levels for successful donation.
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.tipCard} activeOpacity={0.9}>
                <Image 
                  source={require('../../assets/images/icon.png')}
                  style={styles.tipImage} 
                  resizeMode="cover"
                />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Rest Well</Text>
                  <Text style={styles.tipDescription}>
                    Get adequate sleep before your donation day.
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          {/* Bottom padding for tab bar */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </AnimatedScrollView>

      {/* Interactive Modals */}
      {/* Stats Detail Modal */}
      <Modal
        visible={showStatsModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowStatsModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowStatsModal(false)}
        >
          <Animated.View 
            entering={ZoomIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={styles.modalContent}
          >
            <Pressable onPress={() => {}}>
              <View style={styles.modalHeader}>
                <View style={[styles.modalIcon, { backgroundColor: selectedStat?.color + '20' }]}>
                  <Ionicons name={selectedStat?.icon as any} size={32} color={selectedStat?.color} />
                </View>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowStatsModal(false)}
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalTitle}>{selectedStat?.title}</Text>
              <Text style={styles.modalValue}>{selectedStat?.value}</Text>
              <Text style={styles.modalDescription}>{selectedStat?.description}</Text>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: selectedStat?.color }]}
                onPress={() => setShowStatsModal(false)}
              >
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Emergency Modal */}
      <Modal
        visible={showEmergencyModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowEmergencyModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowEmergencyModal(false)}
        >
          <Animated.View 
            entering={SlideInDown.duration(400)}
            exiting={SlideOutDown.duration(300)}
            style={styles.emergencyModalContent}
          >
            <Pressable onPress={() => {}}>
              <View style={styles.emergencyModalHeader}>
                <Animated.View 
                  entering={BounceIn.delay(200)}
                  style={styles.emergencyIcon}
                >
                  <Ionicons name="alert-circle" size={48} color="#FFFFFF" />
                </Animated.View>
                <Text style={styles.emergencyModalTitle}>Emergency Blood Request</Text>
                <Text style={styles.emergencyModalSubtitle}>Critical need in your area</Text>
              </View>
              
              <View style={styles.emergencyDetails}>
                <View style={styles.emergencyDetailItem}>
                  <Ionicons name="location" size={20} color="#DC2626" />
                  <Text style={styles.emergencyDetailText}>City General Hospital - 2.3 miles</Text>
                </View>
                <View style={styles.emergencyDetailItem}>
                  <Ionicons name="time" size={20} color="#DC2626" />
                  <Text style={styles.emergencyDetailText}>Needed within 2 hours</Text>
                </View>
                <View style={styles.emergencyDetailItem}>
                  <Ionicons name="water" size={20} color="#DC2626" />
                  <Text style={styles.emergencyDetailText}>O- Blood Type Required</Text>
                </View>
              </View>
              
              <View style={styles.emergencyActions}>
                <TouchableOpacity 
                  style={styles.emergencyButton}
                  onPress={() => {
                    setShowEmergencyModal(false);
                    Alert.alert('Thank you!', 'We will contact you with more details.');
                  }}
                >
                  <LinearGradient
                    colors={['#DC2626', '#B91C1C']}
                    style={styles.emergencyButtonGradient}
                  >
                    <Ionicons name="heart" size={20} color="#FFFFFF" />
                    <Text style={styles.emergencyButtonText}>I can help</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.emergencySecondaryButton}
                  onPress={() => setShowEmergencyModal(false)}
                >
                  <Text style={styles.emergencySecondaryButtonText}>Maybe later</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowProfileModal(false)}
        >
          <Animated.View 
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={styles.profileModalContent}
          >
            <Pressable onPress={() => {}}>
              <View style={styles.profileModalHeader}>
                <View style={styles.profileAvatar}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.profileAvatarGradient}
                  >
                    <Text style={styles.profileAvatarText}>
                      {user?.first_name?.charAt(0) || user?.user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </Text>
                  </LinearGradient>
                </View>
                <Text style={styles.profileModalTitle}>Profile Overview</Text>
                <Text style={styles.profileModalSubtitle}>
                  {(() => {
                    const first = user?.first_name?.trim() || user?.user?.first_name?.trim();
                    const last = user?.last_name?.trim() || user?.user?.last_name?.trim();
                    if (first || last) return `${first || ''}${last ? ' ' + last : ''}`.trim();
                    return user?.username || user?.user?.username || 'User';
                  })()}
                </Text>
              </View>
              
              <View style={styles.profileOptions}>
                <TouchableOpacity style={styles.profileOption}>
                  <Ionicons name="person-outline" size={24} color="#6B7280" />
                  <Text style={styles.profileOptionText}>Edit Profile</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.profileOption}>
                  <Ionicons name="settings-outline" size={24} color="#6B7280" />
                  <Text style={styles.profileOptionText}>Settings</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.profileOption}>
                  <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
                  <Text style={styles.profileOptionText}>Help & Support</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.profileOption, styles.logoutOption]}
                  onPress={() => {
                    setShowProfileModal(false);
                    Alert.alert(
                      'Logout',
                      'Are you sure you want to logout?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Logout', 
                          style: 'destructive',
                          onPress: logout
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="log-out-outline" size={24} color="#DC2626" />
                  <Text style={[styles.profileOptionText, { color: '#DC2626' }]}>Logout</Text>
                  <Ionicons name="chevron-forward" size={20} color="#DC2626" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.profileCloseButton}
                onPress={() => setShowProfileModal(false)}
              >
                <Text style={styles.profileCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'SF-Pro-Display-Medium',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  blob1: {
    width: 200,
    height: 200,
    top: -80,
    right: -60,
  },
  blob2: {
    width: 150,
    height: 150,
    top: 50,
    left: -80,
  },
  blob3: {
    width: 100,
    height: 100,
    bottom: -20,
    right: 60,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingTop: 10,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E11D48',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  quickActionContent: {
    alignItems: 'center',
  },
  quickActionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  urgentBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 8,
  },
  urgentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
  },
  statCardContent: {
    alignItems: 'flex-start',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  statSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E11D48',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  emergencyBannerContainer: {
    marginBottom: 24,
  },
  emergencyBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyBannerGradient: {
    padding: 20,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIconContainer: {
    marginRight: 16,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E11D48',
    marginBottom: 4,
  },
  emergencySubtext: {
    fontSize: 14,
    color: '#9B1C1C',
    fontWeight: '500',
  },
  emergencyProgress: {
    marginTop: 8,
    height: 4,
    backgroundColor: '#FCA5A5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  emergencyProgressBar: {
    width: '70%',
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: 2,
  },
  emergencyAction: {
    padding: 8,
  },
  appointmentContainer: {
    marginBottom: 24,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  appointmentDateContainer: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  appointmentMonth: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E11D48',
    marginBottom: 4,
  },
  appointmentDay: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  appointmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  appointmentStatusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  appointmentActions: {
    justifyContent: 'center',
  },
  appointmentActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E11D48',
    marginRight: 6,
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipsScrollContent: {
    paddingRight: 20,
  },
  tipCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tipImage: {
    width: '100%',
    height: 120,
  },
  tipContent: {
    padding: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  modalButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Emergency Modal Styles
  emergencyModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  emergencyModalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emergencyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  emergencyModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  emergencyModalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  emergencyDetails: {
    marginBottom: 32,
  },
  emergencyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  emergencyDetailText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  emergencyActions: {
    gap: 16,
  },
  emergencyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emergencyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emergencySecondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  emergencySecondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Profile Modal Styles
  profileModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  profileModalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileAvatar: {
    marginBottom: 16,
  },
  profileAvatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  profileAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  profileModalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  profileOptions: {
    marginBottom: 32,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 12,
  },
  profileOptionText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 16,
    flex: 1,
    fontWeight: '500',
  },
  logoutOption: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  profileCloseButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  profileCloseButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});