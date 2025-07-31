import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../components/NavigationBar';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

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

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { 
          icon: 'person-outline', 
          label: 'Edit Profile', 
          onPress: () => router.push('/edit-profile' as any) 
        },
        { 
          icon: 'medical-outline', 
          label: 'Medical Information', 
          onPress: () => router.push('/edit-medical' as any) 
        },
      ]
    },
    {
      title: 'Settings',
      items: [
        { 
          icon: 'notifications-outline', 
          label: 'Notifications', 
          onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon') 
        },
        { 
          icon: 'lock-closed-outline', 
          label: 'Privacy & Security', 
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon') 
        },
        { 
          icon: 'help-circle-outline', 
          label: 'Help & Support', 
          onPress: () => Alert.alert('Coming Soon', 'Help section will be available soon') 
        },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </Text>
            </View>
          </View>
          
          <View style={styles.userInfo}>
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
            <Text style={styles.userEmail}>
              {user?.email || user?.user?.email || 'No email provided'}
            </Text>
            <View style={styles.donorBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#22C55E" />
              <Text style={styles.donorBadgeText}>Verified Donor</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>O+</Text>
              <Text style={styles.statLabel}>Blood Type</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Lives Saved</Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.sectionItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.sectionItemLeft}>
                  <View style={styles.sectionIcon}>
                    <Ionicons name={item.icon as any} size={20} color="#6B7280" />
                  </View>
                  <Text style={styles.sectionItemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Bottom spacing for navigation bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Navigation Bar */}
      <NavigationBar activeRoute="/profile" />
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
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  donorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  donorBadgeText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '400',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});
