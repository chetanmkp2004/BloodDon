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
import { emergencyAPI } from '../config/api';

interface EmergencyRequest {
  id: number;
  hospital_name: string;
  blood_type_needed: string;
  units_needed: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  patient_age?: number;
  patient_condition: string;
  contact_person: string;
  contact_phone: string;
  location: string;
  expires_at: string;
  created_at: string;
}

export default function EmergencyScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);

  useEffect(() => {
    loadEmergencyRequests();
  }, []);

  const loadEmergencyRequests = async () => {
    try {
      setLoading(true);
      const response = await emergencyAPI.getEmergencyRequests();
      setEmergencyRequests(response.data.filter((req: EmergencyRequest) => req.status === 'active'));
    } catch (error) {
      console.error('Error loading emergency requests:', error);
      Alert.alert('Error', 'Failed to load emergency requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEmergencyRequests();
    setRefreshing(false);
  };

  const handleRespond = async (requestId: number) => {
    try {
      await emergencyAPI.respondToEmergency(requestId, { status: 'interested' });
      Alert.alert('Success', 'Your response has been sent to the hospital.');
      loadEmergencyRequests();
    } catch (error) {
      console.error('Error responding to emergency:', error);
      Alert.alert('Error', 'Failed to send response. Please try again.');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '#DC143C';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#64748B';
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
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
            
            <Text style={styles.headerTitle}>Emergency Requests</Text>
            
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
            <Text style={styles.loadingText}>Loading emergency requests...</Text>
          </View>
        ) : emergencyRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart-circle" size={64} color="#DC143C" />
            </View>
            <Text style={styles.emptyTitle}>No Active Emergency Requests</Text>
            <Text style={styles.emptyText}>
              Great news! There are no urgent blood requests at the moment. 
              Check back later or consider scheduling a regular donation.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {emergencyRequests.length} active emergency request{emergencyRequests.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {emergencyRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.hospitalInfo}>
                    <Text style={styles.hospitalName}>{request.hospital_name}</Text>
                    <View style={styles.urgencyBadge}>
                      <View 
                        style={[
                          styles.urgencyDot, 
                          { backgroundColor: getUrgencyColor(request.urgency) }
                        ]} 
                      />
                      <Text style={[
                        styles.urgencyText, 
                        { color: getUrgencyColor(request.urgency) }
                      ]}>
                        {request.urgency.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bloodTypeContainer}>
                    <Text style={styles.bloodType}>{request.blood_type_needed}</Text>
                  </View>
                </View>

                <View style={styles.requestDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="medical" size={16} color="#64748B" />
                    <Text style={styles.detailText}>
                      {request.units_needed} unit{request.units_needed !== 1 ? 's' : ''} needed
                    </Text>
                  </View>
                  
                  {request.patient_condition && (
                    <View style={styles.detailRow}>
                      <Ionicons name="pulse" size={16} color="#64748B" />
                      <Text style={styles.detailText}>{request.patient_condition}</Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#64748B" />
                    <Text style={styles.detailText}>{request.location}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#64748B" />
                    <Text style={styles.detailText}>
                      {formatTimeRemaining(request.expires_at)}
                    </Text>
                  </View>
                </View>

                <View style={styles.requestFooter}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Contact: {request.contact_person}</Text>
                    <Text style={styles.contactPhone}>{request.contact_phone}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.respondButton}
                    onPress={() => handleRespond(request.id)}
                  >
                    <Text style={styles.respondButtonText}>Respond</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <NavigationBar activeRoute="/emergency" />
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
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 24,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featureList: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 120,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  statsContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 20,
  },
  statsText: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '600',
    textAlign: 'center',
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bloodTypeContainer: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  bloodType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC143C',
  },
  requestDetails: {
    gap: 12,
    marginBottom: 16,
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
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  respondButton: {
    backgroundColor: '#DC143C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  respondButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
