import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const emergencyRequests = [
  {
    id: '1',
    bloodType: 'O-',
    hospital: 'Memorial Hospital',
    distance: '3.2 miles',
    timeLeft: '46 minutes',
    unitsNeeded: 2,
    urgency: 'critical',
    contact: '(555) 123-4567',
    location: '789 Medical Blvd, San Francisco',
    patientCondition: 'Trauma from accident'
  },
  {
    id: '2',
    bloodType: 'A+',
    hospital: 'City General',
    distance: '5.7 miles',
    timeLeft: '1 hour 20 minutes',
    unitsNeeded: 1,
    urgency: 'high',
    contact: '(555) 987-6543',
    location: '456 Healthcare Ave, San Francisco',
    patientCondition: 'Surgery complications'
  },
  {
    id: '3',
    bloodType: 'B+',
    hospital: 'University Medical',
    distance: '8.3 miles',
    timeLeft: '3 hours',
    unitsNeeded: 3,
    urgency: 'medium',
    contact: '(555) 765-4321',
    location: '123 Treatment Dr, San Francisco',
    patientCondition: 'Childbirth complications'
  },
];

export default function EmergencyScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [responding, setResponding] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loadingAnimation = useRef(null);

  useEffect(() => {
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleRespond = (id: string) => {
    setResponding(id);
    
    // Simulate API call
    setTimeout(() => {
      setResponding(null);
      Alert.alert(
        "Response Sent",
        "Thank you for responding to this emergency! The hospital has been notified and will contact you with next steps.",
        [{ text: "OK" }]
      );
    }, 1500);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '#E11D48';
      case 'high': return '#F59E0B';
      case 'medium': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}> 
        <ActivityIndicator size="large" color="#E11D48" style={{ marginBottom: 20 }} />
        <Text style={styles.loadingText}>Loading emergency requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <LinearGradient
          colors={['#E11D48', '#9F1239']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Emergency Requests</Text>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              // Simulate refetching data
              setTimeout(() => {
                setRefreshing(false);
              }, 1500);
            }}
          />
        }
      >
        {emergencyRequests.map((request) => (
          <Animated.View
            key={request.id}
            style={[
              styles.requestCard,
              {
                transform: [
                  {
                    scale: responding === request.id ? pulseAnim : 1,
                  },
                ],
              },
            ]}
          >
            <View style={styles.requestHeader}>
              <Text style={styles.bloodType}>{request.bloodType}</Text>
              <Text style={styles.urgencyLabel}>{request.urgency.toUpperCase()}</Text>
            </View>
            
            <View style={styles.requestDetails}>
              <Text style={styles.hospitalName}>{request.hospital}</Text>
              <Text style={styles.distanceTime}>
                {request.distance} | {request.timeLeft}
              </Text>
              
              <View style={styles.unitsContainer}>
                <Text style={styles.unitsNeeded}>{request.unitsNeeded} units needed</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.respondButton,
                { backgroundColor: getUrgencyColor(request.urgency) },
              ]}
              onPress={() => handleRespond(request.id)}
              disabled={responding !== null}
            >
              {responding === request.id ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.respondButtonText}>Respond</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    position: 'relative',
    minHeight: 90,
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bloodType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#6B7280',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  requestDetails: {
    marginBottom: 12,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  distanceTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  unitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  unitsNeeded: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  respondButton: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  respondButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

