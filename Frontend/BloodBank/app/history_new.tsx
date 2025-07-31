import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface DonationRecord {
  id: string;
  date: string;
  location: string;
  bloodType: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled';
  certificate?: string;
}

export default function HistoryScreen() {
  const [donationHistory] = useState<DonationRecord[]>([
    {
      id: '1',
      date: '2025-06-15',
      location: 'City Hospital',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      certificate: 'CERT001',
    },
    {
      id: '2',
      date: '2025-04-20',
      location: 'Red Cross Center',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      certificate: 'CERT002',
    },
    {
      id: '3',
      date: '2025-02-10',
      location: 'Community Center',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      certificate: 'CERT003',
    },
    {
      id: '4',
      date: '2024-12-05',
      location: 'Blood Bank Central',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      certificate: 'CERT004',
    },
    {
      id: '5',
      date: '2024-09-18',
      location: 'University Hospital',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      certificate: 'CERT005',
    },
  ]);

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

  const getTotalDonated = () => {
    return donationHistory.filter(record => record.status === 'completed').length * 450;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donation History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{donationHistory.filter(r => r.status === 'completed').length}</Text>
              <Text style={styles.statLabel}>Total Donations</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{getTotalDonated()}ml</Text>
              <Text style={styles.statLabel}>Blood Donated</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{donationHistory.filter(r => r.status === 'completed').length * 3}</Text>
              <Text style={styles.statLabel}>Lives Saved</Text>
            </View>
          </View>
        </View>

        {/* Donation Records */}
        <View style={styles.recordsContainer}>
          <Text style={styles.sectionTitle}>Donation Records</Text>
          
          {donationHistory.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={styles.recordDate}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.recordDateText}>{formatDate(record.date)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                  <Text style={styles.statusText}>{record.status.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.recordDetails}>
                <View style={styles.recordRow}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.recordText}>{record.location}</Text>
                </View>
                <View style={styles.recordRow}>
                  <Ionicons name="water-outline" size={16} color="#6B7280" />
                  <Text style={styles.recordText}>{record.bloodType} • {record.amount}</Text>
                </View>
                {record.certificate && (
                  <View style={styles.recordRow}>
                    <Ionicons name="document-outline" size={16} color="#6B7280" />
                    <Text style={styles.recordText}>Certificate: {record.certificate}</Text>
                  </View>
                )}
              </View>

              {record.status === 'completed' && (
                <TouchableOpacity style={styles.certificateButton}>
                  <Ionicons name="download-outline" size={14} color="#DC2626" />
                  <Text style={styles.certificateButtonText}>Download Certificate</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
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
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  recordsContainer: {
    marginBottom: 20,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordDateText: {
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
  recordDetails: {
    gap: 8,
    marginBottom: 12,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '400',
  },
  certificateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 6,
    gap: 6,
  },
  certificateButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});
