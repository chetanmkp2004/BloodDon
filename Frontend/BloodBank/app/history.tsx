import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../components/NavigationBar';
import { donationAPI } from '../config/api';

interface Donation {
  id: number;
  donation_center: {
    id: number;
    name: string;
    address: string;
    phone_number: string;
  };
  scheduled_date: string;
  actual_date?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  blood_type: string;
  units_collected?: number;
  pre_screening_notes?: string;
  post_donation_notes?: string;
  created_at: string;
}

interface DonationStats {
  totalDonations: number;
  totalUnits: number;
  lastDonation?: string;
  nextEligible?: string;
}

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    totalUnits: 0,
  });

  useEffect(() => {
    loadDonationHistory();
  }, []);

  const loadDonationHistory = async () => {
    try {
      setLoading(true);
      const response = await donationAPI.getDonations();
      const donationData = response.data || [];
      setDonations(donationData);
      
      // Calculate stats
      const completed = donationData.filter((d: Donation) => d.status === 'completed');
      const totalUnits = completed.reduce((sum: number, d: Donation) => sum + (d.units_collected || 0), 0);
      const lastDonation = completed.length > 0 ? completed[0].actual_date : undefined;
      
      setStats({
        totalDonations: completed.length,
        totalUnits,
        lastDonation,
        nextEligible: lastDonation ? calculateNextEligible(lastDonation) : undefined,
      });
    } catch (error) {
      console.error('Error loading donation history:', error);
      Alert.alert('Error', 'Failed to load donation history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateNextEligible = (lastDonationDate: string): string => {
    const lastDate = new Date(lastDonationDate);
    const nextDate = new Date(lastDate.getTime() + (56 * 24 * 60 * 60 * 1000)); // 56 days later
    return nextDate.toISOString().split('T')[0];
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDonationHistory();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#059669';
      case 'scheduled': return '#1E40AF';
      case 'cancelled': return '#DC143C';
      case 'no_show': return '#D97706';
      default: return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'scheduled': return 'calendar';
      case 'cancelled': return 'close-circle';
      case 'no_show': return 'warning';
      default: return 'time';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#64748B" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Donation History</Text>
            
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#DC143C']}
            tintColor="#DC143C"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DC143C" />
            <Text style={styles.loadingText}>Loading donation history...</Text>
          </View>
        ) : (
          <>
            {/* Statistics Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name="heart" size={24} color="#DC143C" />
                </View>
                <Text style={styles.statNumber}>{stats.totalDonations}</Text>
                <Text style={styles.statLabel}>Total Donations</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name="water" size={24} color="#1E40AF" />
                </View>
                <Text style={styles.statNumber}>{stats.totalUnits.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Units Donated</Text>
              </View>
            </View>

            {stats.lastDonation && (
              <View style={styles.eligibilityCard}>
                <View style={styles.eligibilityHeader}>
                  <Ionicons name="calendar" size={20} color="#059669" />
                  <Text style={styles.eligibilityTitle}>Next Donation Eligibility</Text>
                </View>
                <Text style={styles.eligibilityDate}>
                  {stats.nextEligible ? formatDate(stats.nextEligible) : 'Available now'}
                </Text>
                <Text style={styles.eligibilitySubtext}>
                  Last donation: {formatDate(stats.lastDonation)}
                </Text>
              </View>
            )}

            {/* Donation History */}
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Donation History</Text>
              
              {donations.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="heart-outline" size={48} color="#64748B" />
                  </View>
                  <Text style={styles.emptyTitle}>No Donations Yet</Text>
                  <Text style={styles.emptyText}>
                    Start your donation journey today! Book your first appointment to help save lives.
                  </Text>
                </View>
              ) : (
                donations.map((donation) => (
                  <View key={donation.id} style={styles.donationCard}>
                    <View style={styles.donationHeader}>
                      <View style={styles.donationInfo}>
                        <Text style={styles.centerName}>{donation.donation_center.name}</Text>
                        <Text style={styles.donationDate}>
                          {formatDate(donation.actual_date || donation.scheduled_date)}
                        </Text>
                      </View>
                      
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(donation.status) + '20' }]}>
                        <Ionicons 
                          name={getStatusIcon(donation.status)} 
                          size={16} 
                          color={getStatusColor(donation.status)} 
                        />
                        <Text style={[styles.statusText, { color: getStatusColor(donation.status) }]}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.donationDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={16} color="#64748B" />
                        <Text style={styles.detailText}>{donation.donation_center.address}</Text>
                      </View>
                      
                      {donation.blood_type && (
                        <View style={styles.detailRow}>
                          <Ionicons name="water-outline" size={16} color="#64748B" />
                          <Text style={styles.detailText}>Blood Type: {donation.blood_type}</Text>
                        </View>
                      )}
                      
                      {donation.units_collected && (
                        <View style={styles.detailRow}>
                          <Ionicons name="medical-outline" size={16} color="#64748B" />
                          <Text style={styles.detailText}>Units Collected: {donation.units_collected}</Text>
                        </View>
                      )}
                    </View>

                    {donation.post_donation_notes && (
                      <View style={styles.notesSection}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>{donation.post_donation_notes}</Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>
          </>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <NavigationBar activeRoute="/history" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  backButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  eligibilityCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  eligibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  eligibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  eligibilityDate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  eligibilitySubtext: {
    fontSize: 14,
    color: '#64748B',
  },
  historySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  donationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  donationInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  donationDate: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  donationDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
  notesSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  notesLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 120,
  },
});
