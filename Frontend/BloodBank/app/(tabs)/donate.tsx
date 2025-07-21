import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated as RNAnimated,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  withSpring,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
  SlideInDown,
  FadeIn,
  ZoomIn,
  SlideInUp,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING = 20;

const locations = [
  {
    id: 1,
    name: 'City Blood Bank',
    address: '123 Medical Center Blvd',
    distance: '2.3 miles',
    rating: 4.8,
    slots: [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
      { time: '12:00 PM', available: true },
      { time: '01:00 PM', available: false },
      { time: '02:00 PM', available: true },
    ],
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 2,
    name: 'Memorial Hospital',
    address: '456 Healthcare Drive',
    distance: '4.1 miles',
    rating: 4.5,
    slots: [
      { time: '09:00 AM', available: false },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '12:00 PM', available: false },
      { time: '01:00 PM', available: true },
      { time: '02:00 PM', available: true },
    ],
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4424,
    },
  },
  {
    id: 3,
    name: 'Community Donor Center',
    address: '789 Wellness Ave',
    distance: '5.7 miles',
    rating: 4.7,
    slots: [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: false },
      { time: '11:00 AM', available: true },
      { time: '12:00 PM', available: true },
      { time: '01:00 PM', available: true },
      { time: '02:00 PM', available: false },
    ],
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4224,
    },
  },
];

export default function DonateScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedDate, setSelectedDate] = useState('2025-07-17');
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const animation = useRef(new RNAnimated.Value(0)).current;
  const mapAnimation = useSharedValue(0);
  const headerAnimation = useSharedValue(0);
  const cardAnimation = useSharedValue(0);

  // Initialize animations
  React.useEffect(() => {
    headerAnimation.value = withDelay(100, withSpring(1));
    cardAnimation.value = withDelay(300, withSpring(1));
  }, []);

  const onCardPress = (index: number) => {
    // Animate card selection
    mapAnimation.value = withSpring(index);
    setSelectedLocation(locations[index]);
  };

  const handleScheduleAppointment = () => {
    if (!selectedLocation || !selectedTime) {
      Alert.alert('Missing Information', 'Please select a location and time slot');
      return;
    }
    setShowAppointmentModal(true);
  };

  const confirmAppointment = () => {
    setShowAppointmentModal(false);
    Alert.alert(
      'Appointment Scheduled!',
      `Your donation appointment has been scheduled at ${selectedLocation?.name} on ${selectedDate} at ${selectedTime}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(headerAnimation.value, [0, 1], [0, 1], Extrapolate.CLAMP),
      transform: [
        {
          translateY: interpolate(headerAnimation.value, [0, 1], [-20, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(cardAnimation.value, [0, 1], [0, 1], Extrapolate.CLAMP),
      transform: [
        {
          translateY: interpolate(cardAnimation.value, [0, 1], [50, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const generateDateArray = () => {
    const today = new Date();
    const dateArray = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      dateArray.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }
    
    return dateArray;
  };

  const dates = generateDateArray();

  const renderDateItem = (item: { date: string; day: number; month: string; dayName: string }, index: number) => {
    const isSelected = item.date === selectedDate;
    
    return (
      <Animated.View
        key={item.date}
        entering={SlideInUp.delay(index * 50).springify()}
      >
        <TouchableOpacity
          style={[styles.dateItem, isSelected && styles.dateItemSelected]}
          onPress={() => setSelectedDate(item.date)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>{item.dayName}</Text>
          <Animated.View 
            style={[
              styles.dateBadge, 
              isSelected && styles.dateBadgeSelected
            ]}
            entering={isSelected ? ZoomIn.springify() : undefined}
          >
            <Text style={[styles.dateNum, isSelected && styles.dateTextSelected]}>{item.day}</Text>
          </Animated.View>
          <Text style={[styles.dateMonth, isSelected && styles.dateTextSelected]}>{item.month}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTimeSlot = (slot: { time: string; available: boolean }, index: number) => {
    const isSelected = selectedTime === slot.time;
    
    return (
      <Animated.View
        key={index}
        entering={SlideInLeft.delay(index * 50).springify()}
      >
        <TouchableOpacity
          style={[
            styles.timeSlot,
            !slot.available && styles.timeSlotUnavailable,
            isSelected && styles.timeSlotSelected
          ]}
          onPress={() => {
            if (slot.available) {
              setSelectedTime(slot.time);
            }
          }}
          disabled={!slot.available}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.timeSlotText,
              !slot.available && styles.timeSlotTextUnavailable,
              isSelected && styles.timeSlotTextSelected
            ]}
          >
            {slot.time}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 10 }, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>Schedule Donation</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowLocationModal(true)}
        >
          <Ionicons name="options-outline" size={22} color="#1F2937" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Calendar Strip */}
      <Animated.View 
        style={styles.calendarStrip}
        entering={SlideInDown.delay(200).springify()}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarContent}
        >
          {dates.map(renderDateItem)}
        </ScrollView>
      </Animated.View>
      
      {/* Map View Placeholder */}
      <Animated.View 
        style={styles.mapContainer}
        entering={FadeIn.delay(400).duration(800)}
      >
        <View style={styles.mapPlaceholder}>
          <Animated.View entering={ZoomIn.delay(600).springify()}>
            <Ionicons name="location" size={64} color="#E11D48" />
          </Animated.View>
          <Animated.Text 
            style={styles.mapPlaceholderText}
            entering={SlideInUp.delay(700).springify()}
          >
            Blood Donation Centers
          </Animated.Text>
          <Animated.Text 
            style={styles.mapPlaceholderSubtext}
            entering={SlideInUp.delay(800).springify()}
          >
            Find locations near you
          </Animated.Text>
        </View>
        
        <Animated.View entering={SlideInRight.delay(500).springify()}>
          <TouchableOpacity style={styles.locationButton}>
            <Ionicons name="locate" size={22} color="#1F2937" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      
      {/* Location Cards */}
      <Animated.View style={[styles.cardsContainer, cardAnimatedStyle]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          snapToInterval={CARD_WIDTH + SPACING}
          snapToAlignment="center"
          contentContainerStyle={styles.cardsContent}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const index = Math.floor(
              (event.nativeEvent.contentOffset.x + (CARD_WIDTH + SPACING) / 2) / 
              (CARD_WIDTH + SPACING)
            );
            if (index >= 0 && index < locations.length) {
              setSelectedLocation(locations[index]);
              mapAnimation.value = withSpring(index);
            }
          }}
        >
          {locations.map((location, index) => {
            return (
              <Animated.View
                key={location.id}
                style={[styles.card]}
                entering={SlideInUp.delay(500 + index * 100).springify()}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{location.name}</Text>
                    <Text style={styles.cardAddress}>{location.address}</Text>
                  </View>
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{location.distance}</Text>
                  </View>
                </View>
                
                <View style={styles.cardRating}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.cardRatingText}>{location.rating}</Text>
                  <Text style={styles.cardReviewCount}>(120 reviews)</Text>
                </View>
                
                <View style={styles.timeSlotsContainer}>
                  <Text style={styles.timeSlotsTitle}>Available Time Slots</Text>
                  <View style={styles.timeSlots}>
                    {location.slots.map(renderTimeSlot)}
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.scheduleButton}
                  activeOpacity={0.8}
                  onPress={handleScheduleAppointment}
                >
                  <LinearGradient
                    colors={['#E11D48', '#BE123C']}
                    style={styles.scheduleButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.scheduleButtonText}>Schedule Appointment</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
      
      {/* Bottom Tab Spacing */}
      <View style={{ height: 80 }} />

      {/* Appointment Confirmation Modal */}
      <Modal
        visible={showAppointmentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAppointmentModal(false)}
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setShowAppointmentModal(false)}
          >
            <Animated.View 
              style={styles.appointmentModalContent}
              entering={SlideInDown.springify()}
            >
              <Pressable onPress={() => {}}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIcon}>
                    <Ionicons name="calendar-outline" size={28} color="#E11D48" />
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowAppointmentModal(false)}
                  >
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>Confirm Appointment</Text>
                
                <View style={styles.appointmentDetails}>
                  <View style={styles.appointmentDetailRow}>
                    <Ionicons name="location-outline" size={20} color="#6B7280" />
                    <View style={styles.appointmentDetailText}>
                      <Text style={styles.appointmentDetailLabel}>Location</Text>
                      <Text style={styles.appointmentDetailValue}>{selectedLocation?.name}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentDetailRow}>
                    <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                    <View style={styles.appointmentDetailText}>
                      <Text style={styles.appointmentDetailLabel}>Date</Text>
                      <Text style={styles.appointmentDetailValue}>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.appointmentDetailRow}>
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                    <View style={styles.appointmentDetailText}>
                      <Text style={styles.appointmentDetailLabel}>Time</Text>
                      <Text style={styles.appointmentDetailValue}>{selectedTime}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalSecondaryButton}
                    onPress={() => setShowAppointmentModal(false)}
                  >
                    <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.modalPrimaryButton}
                    onPress={confirmAppointment}
                  >
                    <LinearGradient
                      colors={['#E11D48', '#BE123C']}
                      style={styles.modalPrimaryButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.modalPrimaryButtonText}>Confirm</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Animated.View>
          </Pressable>
        </BlurView>
      </Modal>

      {/* Location Filter Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setShowLocationModal(false)}
          >
            <Animated.View 
              style={styles.filterModalContent}
              entering={SlideInDown.springify()}
            >
              <Pressable onPress={() => {}}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalIcon}>
                    <Ionicons name="options-outline" size={28} color="#E11D48" />
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowLocationModal(false)}
                  >
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>Filter Locations</Text>
                
                <View style={styles.filterOptions}>
                  <TouchableOpacity style={styles.filterOption}>
                    <Ionicons name="location-outline" size={20} color="#6B7280" />
                    <Text style={styles.filterOptionText}>Distance (Nearest)</Text>
                    <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.filterOption}>
                    <Ionicons name="star-outline" size={20} color="#6B7280" />
                    <Text style={styles.filterOptionText}>Rating (Highest)</Text>
                    <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.filterOption}>
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                    <Text style={styles.filterOptionText}>Available Slots</Text>
                    <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.filterApplyButton}
                  onPress={() => setShowLocationModal(false)}
                >
                  <LinearGradient
                    colors={['#E11D48', '#BE123C']}
                    style={styles.filterApplyButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.filterApplyButtonText}>Apply Filters</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Pressable>
            </Animated.View>
          </Pressable>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarStrip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  calendarContent: {
    paddingHorizontal: 10,
  },
  dateItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateItemSelected: {
    backgroundColor: '#F9FAFB',
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  dateBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateBadgeSelected: {
    backgroundColor: '#E11D48',
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  dateTextSelected: {
    color: '#E11D48',
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  locationButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    overflow: 'visible',
    height: CARD_HEIGHT,
  },
  cardsContent: {
    paddingHorizontal: SPACING / 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: SPACING / 2,
    padding: 16,
    width: CARD_WIDTH,
    height: CARD_HEIGHT - 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardAddress: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBadgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardRatingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 4,
    marginRight: 4,
  },
  cardReviewCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeSlotsContainer: {
    marginBottom: 12,
  },
  timeSlotsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  timeSlotSelected: {
    backgroundColor: '#E11D48',
  },
  timeSlotUnavailable: {
    backgroundColor: '#F9FAFB',
    opacity: 0.5,
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotTextUnavailable: {
    color: '#9CA3AF',
  },
  scheduleButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 'auto',
  },
  scheduleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  appointmentModalContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    minWidth: width * 0.85,
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  filterModalContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    minWidth: width * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  appointmentDetails: {
    marginBottom: 24,
  },
  appointmentDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appointmentDetailText: {
    marginLeft: 16,
    flex: 1,
  },
  appointmentDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  appointmentDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalPrimaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalPrimaryButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterOptions: {
    marginBottom: 24,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  filterApplyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  filterApplyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  filterApplyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});