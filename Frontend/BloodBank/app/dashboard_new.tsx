import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface DashboardStats {
  totalDonations: number;
  lastDonation: string;
  nextEligible: string;
  bloodType: string;
}

export default function DashboardScreen() {
  const { user, logout, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    lastDonation: 'Never',
    nextEligible: 'Now',
    bloodType: 'Unknown',
  });

  useEffect(() => {
    // Check authentication
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

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
            await logout();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const quickActions = [
    {
      id: 'donate',
      title: 'Schedule Donation',
      subtitle: 'Book an appointment',
      icon: 'heart',
      color: '#DC143C',
      onPress: () => Alert.alert('Feature Coming Soon', 'Donation scheduling will be available soon!'),
    },
    {
      id: 'history',
      title: 'Donation History',
      subtitle: 'View past donations',
      icon: 'time',
      color: '#1E40AF',
      onPress: () => Alert.alert('Feature Coming Soon', 'Donation history will be available soon!'),
    },
    {
      id: 'emergency',
      title: 'Emergency Request',
      subtitle: 'Urgent blood needed',
      icon: 'alert-circle',
      color: '#DC143C',
      onPress: () => Alert.alert('Feature Coming Soon', 'Emergency requests will be available soon!'),
    },
    {
      id: 'rewards',
      title: 'Rewards & Badges',
      subtitle: 'Track achievements',
      icon: 'trophy',
      color: '#B91C1C',
      onPress: () => Alert.alert('Feature Coming Soon', 'Rewards system will be available soon!'),
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#F8FAFC', '#F1F5F9']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}>
            <Ionicons name="heart" size={30} color="#DC143C" />
          </View>
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Professional Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#DC143C', '#B91C1C']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </Text>
                </LinearGradient>
                <View style={styles.statusIndicator}>
                  <View style={styles.onlineStatus} />
                </View>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                </Text>
                <View style={styles.donorBadge}>
                  <Ionicons name="shield-checkmark" size={14} color="#059669" />
                  <Text style={styles.donorBadgeText}>Verified Donor</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <View style={styles.logoutIcon}>
                <Ionicons name="log-out-outline" size={20} color="#64748B" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

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
      >
        {/* Trust Badge */}
        <View style={styles.trustBadge}>
          <View style={styles.trustIcon}>
            <Ionicons name="shield-checkmark" size={18} color="#059669" />
          </View>
          <Text style={styles.trustText}>
            Secure • Verified Medical Platform • HIPAA Compliant
          </Text>
        </View>

        {/* Medical Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Medical Profile</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="heart" size={24} color="#DC143C" />
              </View>
              <Text style={styles.statNumber}>{stats.totalDonations}</Text>
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
              <Text style={styles.statNumber}>{stats.lastDonation}</Text>
              <Text style={styles.statLabel}>Last Donation</Text>
              <Text style={styles.statSubLabel}>Verified Safe</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="time" size={24} color="#D97706" />
              </View>
              <Text style={styles.statNumber}>{stats.nextEligible}</Text>
              <Text style={styles.statLabel}>Next Eligible</Text>
              <Text style={styles.statSubLabel}>Medical Guidelines</Text>
            </View>
          </View>
        </View>

        {/* Medical Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Medical Services</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as any} size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                <View style={styles.actionArrow}>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Medical Impact Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.medicalBanner}>
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
          </View>
        </View>

        {/* Medical Alerts */}
        <View style={styles.emergencyContainer}>
          <Text style={styles.sectionTitle}>Medical Alerts</Text>
          
          <View style={styles.alertCard}>
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
            <TouchableOpacity style={styles.alertButton}>
              <LinearGradient
                colors={['#DC143C', '#B91C1C']}
                style={styles.alertButtonGradient}
              >
                <Ionicons name="heart" size={16} color="#FFFFFF" style={styles.alertButtonIcon} />
                <Text style={styles.alertButtonText}>Donate Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medical Safety Information */}
        <View style={styles.safetyContainer}>
          <Text style={styles.sectionTitle}>Safety & Compliance</Text>
          
          <View style={styles.safetyCard}>
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
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
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
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alertText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '400',
  },
  alertButton: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  alertButtonIcon: {
    marginRight: 8,
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  safetyContainer: {
    marginBottom: 32,
  },
  safetyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  safetyItems: {
    gap: 12,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyItemText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
    fontWeight: '400',
  },
  bottomSpacing: {
    height: 32,
  },
});
