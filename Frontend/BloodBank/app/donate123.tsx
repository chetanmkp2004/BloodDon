import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../components/NavigationBar';

export default function DonateScreen() {
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
            
            <Text style={styles.headerTitle}>Schedule Donation</Text>
            
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.comingSoonContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart" size={64} color="#DC143C" />
          </View>
          <Text style={styles.comingSoonTitle}>Donation Scheduling</Text>
          <Text style={styles.comingSoonText}>
            This feature is coming soon! You'll be able to schedule blood donation 
            appointments at nearby medical centers with real-time availability.
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.featureText}>Real-time appointment booking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.featureText}>Find nearby donation centers</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.featureText}>Medical pre-screening</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.featureText}>Automated reminders</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <NavigationBar activeRoute="/donate" />
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
});
