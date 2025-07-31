import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Donor {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  distance: string;
  lastDonation: string;
  phone: string;
  availability: 'available' | 'not_available';
}

export default function SearchDonorsScreen() {
  const [searchBloodType, setSearchBloodType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const mockDonors: Donor[] = [
    {
      id: '1',
      name: 'John Smith',
      bloodType: 'O+',
      location: 'Downtown Area',
      distance: '2.5 km',
      lastDonation: '2025-04-15',
      phone: '+1234567890',
      availability: 'available',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      bloodType: 'O+',
      location: 'City Center',
      distance: '3.8 km',
      lastDonation: '2025-03-20',
      phone: '+1234567891',
      availability: 'available',
    },
    {
      id: '3',
      name: 'Mike Davis',
      bloodType: 'O+',
      location: 'North Side',
      distance: '5.2 km',
      lastDonation: '2025-02-10',
      phone: '+1234567892',
      availability: 'not_available',
    },
  ];

  const handleSearch = () => {
    if (!searchBloodType) {
      Alert.alert('Error', 'Please select a blood type to search');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredDonors = mockDonors.filter(
        donor => donor.bloodType === searchBloodType
      );
      setDonors(filteredDonors);
      setIsSearching(false);
    }, 1500);
  };

  const handleContactDonor = (donor: Donor) => {
    Alert.alert(
      'Contact Donor',
      `Would you like to contact ${donor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Alert.alert('Calling', `Calling ${donor.phone}`)
        },
        { 
          text: 'Message', 
          onPress: () => Alert.alert('Message', `Sending message to ${donor.name}`)
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
        <Text style={styles.headerTitle}>Search Donors</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Form */}
        <View style={styles.searchForm}>
          <Text style={styles.sectionTitle}>Find Blood Donors</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Blood Type *</Text>
            <View style={styles.bloodTypeContainer}>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.bloodTypeButton,
                    searchBloodType === type && styles.bloodTypeButtonActive
                  ]}
                  onPress={() => setSearchBloodType(type)}
                >
                  <Text style={[
                    styles.bloodTypeText,
                    searchBloodType === type && styles.bloodTypeTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter city or area"
              value={searchLocation}
              onChangeText={setSearchLocation}
            />
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <Text style={styles.searchButtonText}>Searching...</Text>
            ) : (
              <>
                <Ionicons name="search" size={20} color="#FFFFFF" />
                <Text style={styles.searchButtonText}>Search Nearby Donors</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {donors.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>
              Found {donors.length} donor{donors.length !== 1 ? 's' : ''}
            </Text>
            
            {donors.map((donor) => (
              <View key={donor.id} style={styles.donorCard}>
                <View style={styles.donorHeader}>
                  <View style={styles.donorInfo}>
                    <Text style={styles.donorName}>{donor.name}</Text>
                    <View style={styles.donorMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="water" size={14} color="#DC2626" />
                        <Text style={styles.metaText}>{donor.bloodType}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text style={styles.metaText}>{donor.location}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="navigate-outline" size={14} color="#6B7280" />
                        <Text style={styles.metaText}>{donor.distance}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[
                    styles.availabilityBadge,
                    { backgroundColor: donor.availability === 'available' ? '#22C55E' : '#EF4444' }
                  ]}>
                    <Text style={styles.availabilityText}>
                      {donor.availability === 'available' ? 'Available' : 'Not Available'}
                    </Text>
                  </View>
                </View>

                <View style={styles.donorDetails}>
                  <Text style={styles.lastDonationText}>
                    Last donation: {formatDate(donor.lastDonation)}
                  </Text>
                </View>

                {donor.availability === 'available' && (
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleContactDonor(donor)}
                  >
                    <Ionicons name="call-outline" size={16} color="#DC2626" />
                    <Text style={styles.contactButtonText}>Contact Donor</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* No Results */}
        {donors.length === 0 && searchBloodType && !isSearching && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={48} color="#9CA3AF" />
            <Text style={styles.noResultsTitle}>No donors found</Text>
            <Text style={styles.noResultsText}>
              Try searching with a different blood type or expand your search area.
            </Text>
          </View>
        )}

        {/* Emergency Notice */}
        <View style={styles.emergencyNotice}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="warning" size={20} color="#F59E0B" />
            <Text style={styles.emergencyTitle}>Emergency?</Text>
          </View>
          <Text style={styles.emergencyText}>
            For urgent blood requirements, please contact your nearest hospital or emergency services immediately.
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>Emergency Contacts</Text>
          </TouchableOpacity>
        </View>
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
  searchForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  bloodTypeButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  bloodTypeTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  searchButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  searchButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  donorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  donorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  donorMeta: {
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  donorDetails: {
    marginBottom: 12,
  },
  lastDonationText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 8,
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  emergencyNotice: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 20,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  emergencyText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 12,
  },
  emergencyButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  emergencyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
