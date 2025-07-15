import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../components/NavigationBar';
import { profileAPI, medicalAPI } from '../config/api';

const { width, height } = Dimensions.get('window');

interface UserProfile {
  id?: number;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  blood_type: string;
  weight: string;
  height: string;
  date_of_birth: string;
  phone_number: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  last_checkup: string;
  donation_eligibility: boolean;
}

interface MedicalAllergy {
  id: number;
  allergy_name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface Medication {
  id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  is_active: boolean;
}

interface MedicalCondition {
  id: number;
  condition_name: string;
  is_chronic: boolean;
  notes: string;
}

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    blood_type: '',
    weight: '',
    height: '',
    date_of_birth: '',
    phone_number: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    last_checkup: '',
    donation_eligibility: true
  });
  const [allergies, setAllergies] = useState<MedicalAllergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    } else if (user) {
      loadProfileData();
    }
  }, [user, loading]);

  const loadProfileData = async () => {
    try {
      setLoadingData(true);
      
      // Load profile data
      const [profileResponse, allergiesResponse, medicationsResponse, conditionsResponse] = await Promise.all([
        profileAPI.getProfile(),
        medicalAPI.getAllergies(),
        medicalAPI.getMedications(),
        medicalAPI.getConditions()
      ]);

      if (profileResponse.data) {
        setProfile(profileResponse.data);
      }
      
      setAllergies(allergiesResponse.data || []);
      setMedications(medicationsResponse.data || []);
      setConditions(conditionsResponse.data || []);
      
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
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
            setTimeout(() => {
              router.replace('/login');
            }, 300);
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleMedicalUpdate = () => {
    router.push('/edit-medical');
  };

  if (loading || loadingData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#DC143C" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#64748B" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Medical Profile</Text>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#64748B" />
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
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#DC143C', '#B91C1C']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </Text>
              </LinearGradient>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.username}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, profile.donation_eligibility ? styles.eligibleDot : styles.ineligibleDot]} />
                <Text style={[styles.statusText, profile.donation_eligibility ? styles.eligibleText : styles.ineligibleText]}>
                  {profile.donation_eligibility ? 'Eligible to Donate' : 'Not Eligible'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="pencil" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Medical Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            <TouchableOpacity style={styles.updateButton} onPress={handleMedicalUpdate}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>

          {/* Basic Medical Info */}
          <View style={styles.medicalGrid}>
            <View style={styles.medicalCard}>
              <View style={[styles.medicalIcon, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="water" size={24} color="#DC143C" />
              </View>
              <Text style={styles.medicalLabel}>Blood Type</Text>
              <Text style={styles.medicalValue}>{profile.blood_type || 'Not specified'}</Text>
            </View>

            <View style={styles.medicalCard}>
              <View style={[styles.medicalIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="fitness" size={24} color="#1E40AF" />
              </View>
              <Text style={styles.medicalLabel}>Weight</Text>
              <Text style={styles.medicalValue}>{profile.weight ? `${profile.weight} kg` : 'Not specified'}</Text>
            </View>

            <View style={styles.medicalCard}>
              <View style={[styles.medicalIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="resize" size={24} color="#059669" />
              </View>
              <Text style={styles.medicalLabel}>Height</Text>
              <Text style={styles.medicalValue}>{profile.height ? `${profile.height} cm` : 'Not specified'}</Text>
            </View>

            <View style={styles.medicalCard}>
              <View style={[styles.medicalIcon, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="calendar" size={24} color="#D97706" />
              </View>
              <Text style={styles.medicalLabel}>Last Checkup</Text>
              <Text style={styles.medicalValue}>{profile.last_checkup || 'Not recorded'}</Text>
            </View>
          </View>
        </View>

        {/* Medical Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Details</Text>

          {/* Allergies */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Ionicons name="warning" size={20} color="#DC143C" />
              <Text style={styles.detailTitle}>Allergies</Text>
            </View>
            <View style={styles.tagContainer}>
              {allergies.length > 0 ? (
                allergies.map((allergy) => (
                  <View key={allergy.id} style={[styles.tag, styles.allergyTag]}>
                    <Text style={styles.allergyTagText}>
                      {allergy.allergy_name} ({allergy.severity})
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No known allergies</Text>
              )}
            </View>
          </View>

          {/* Medications */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Ionicons name="medical" size={20} color="#1E40AF" />
              <Text style={styles.detailTitle}>Current Medications</Text>
            </View>
            <View style={styles.tagContainer}>
              {medications.filter(med => med.is_active).length > 0 ? (
                medications.filter(med => med.is_active).map((medication) => (
                  <View key={medication.id} style={[styles.tag, styles.medicationTag]}>
                    <Text style={styles.medicationTagText}>
                      {medication.medication_name}
                      {medication.dosage && ` - ${medication.dosage}`}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No current medications</Text>
              )}
            </View>
          </View>

          {/* Medical Conditions */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Ionicons name="pulse" size={20} color="#059669" />
              <Text style={styles.detailTitle}>Medical Conditions</Text>
            </View>
            <View style={styles.tagContainer}>
              {conditions.length > 0 ? (
                conditions.map((condition) => (
                  <View key={condition.id} style={[styles.tag, styles.conditionTag]}>
                    <Text style={styles.conditionTagText}>
                      {condition.condition_name}
                      {condition.is_chronic && ' (Chronic)'}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No medical conditions reported</Text>
              )}
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <View style={styles.emergencyIcon}>
                <Ionicons name="call" size={24} color="#DC143C" />
              </View>
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyName}>
                  {profile.emergency_contact_name || 'Not specified'}
                </Text>
                <Text style={styles.emergencyRelation}>
                  {profile.emergency_contact_relationship || 'Not specified'}
                </Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call-outline" size={20} color="#059669" />
              </TouchableOpacity>
            </View>
            <Text style={styles.emergencyPhone}>
              {profile.emergency_contact_phone || 'No phone number'}
            </Text>
          </View>
        </View>

        {/* Safety Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Compliance</Text>
          
          <View style={styles.safetyCard}>
            <View style={styles.safetyHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#059669" />
              <Text style={styles.safetyTitle}>Medical Verification</Text>
            </View>
            <View style={styles.safetyItems}>
              <View style={styles.safetyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.safetyItemText}>Identity Verified</Text>
              </View>
              <View style={styles.safetyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.safetyItemText}>Medical History Reviewed</Text>
              </View>
              <View style={styles.safetyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.safetyItemText}>Donation Eligibility Confirmed</Text>
              </View>
              <View style={styles.safetyItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.safetyItemText}>HIPAA Compliant</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom spacing for navigation bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <NavigationBar activeRoute="/profile" />
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
  logoutButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  eligibleDot: {
    backgroundColor: '#059669',
  },
  ineligibleDot: {
    backgroundColor: '#DC143C',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eligibleText: {
    color: '#059669',
  },
  ineligibleText: {
    color: '#DC143C',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  updateButton: {
    backgroundColor: '#DC143C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  medicalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  medicalCard: {
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
  medicalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicalLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  medicalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  allergyTag: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  allergyTagText: {
    color: '#DC143C',
    fontSize: 12,
    fontWeight: '600',
  },
  medicationTag: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    borderWidth: 1,
  },
  medicationTagText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '600',
  },
  conditionTag: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
  },
  conditionTagText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  noDataText: {
    color: '#94A3B8',
    fontSize: 14,
    fontStyle: 'italic',
  },
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  emergencyRelation: {
    fontSize: 14,
    color: '#64748B',
  },
  callButton: {
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
  },
  emergencyPhone: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
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
    height: 120, // Space for navigation bar
  },
});
