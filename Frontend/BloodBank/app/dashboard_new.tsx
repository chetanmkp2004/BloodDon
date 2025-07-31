import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../components/NavigationBar';

interface DonationHistory {
  id: string;
  date: string;
  location: string;
  bloodType: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface DashboardStats {
  totalDonations: number;
  lastDonation: string;
  nextEligible: string;
  bloodType: string;
  donationsThisYear: number;
}

export default function DashboardScreen() {
  const { user, logout, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 5,
    lastDonation: '2025-06-15',
    nextEligible: '2025-08-10',
    bloodType: 'O+',
    donationsThisYear: 3,
  });

  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([
    {
      id: '1',
      date: '2025-06-15',
      location: 'City Hospital',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
    },
    {
      id: '2',
      date: '2025-04-20',
      location: 'Red Cross Center',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
    },
    {
      id: '3',
      date: '2025-02-10',
      location: 'Community Center',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
    },
  ]);

  useEffect(() => {
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

  const handleSearchDonors = () => {
    router.push('/search-donors');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22C55E';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </Text>
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
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#DC2626']}
            tintColor="#DC2626"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Donation Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="heart" size={24} color="#DC2626" />
              <Text style={styles.statNumber}>{stats.totalDonations}</Text>
              <Text style={styles.statLabel}>Total Donations</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="water" size={24} color="#2563EB" />
              <Text style={styles.statNumber}>{stats.bloodType}</Text>
              <Text style={styles.statLabel}>Blood Type</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#059669" />
              <Text style={styles.statNumber}>{formatDate(stats.lastDonation)}</Text>
              <Text style={styles.statLabel}>Last Donation</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#D97706" />
              <Text style={styles.statNumber}>{formatDate(stats.nextEligible)}</Text>
              <Text style={styles.statLabel}>Next Eligible</Text>
            </View>
          </View>
        </View>

        {/* Search Donors Button */}
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearchDonors}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Search Nearby Donors</Text>
          </TouchableOpacity>
        </View>

        {/* Donation History */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Donation History</Text>
          
          {donationHistory.map((donation) => (
            <View key={donation.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyDate}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.historyDateText}>{formatDate(donation.date)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(donation.status) }]}>
                  <Text style={styles.statusText}>{donation.status.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.historyDetails}>
                <View style={styles.historyRow}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.historyText}>{donation.location}</Text>
                </View>
                <View style={styles.historyRow}>
                  <Ionicons name="water-outline" size={16} color="#6B7280" />
                  <Text style={styles.historyText}>{donation.bloodType} • {donation.amount}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacing for navigation bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Navigation Bar */}
      <NavigationBar activeRoute="/dashboard" />
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
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
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
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  searchButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  historyContainer: {
    marginBottom: 24,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  historyDetails: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '400',
  },
  bottomSpacing: {
    height: 100,
  },
});
