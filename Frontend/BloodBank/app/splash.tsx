import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { isAuthenticated, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const startAnimations = () => {
      // Main fade and scale animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimations();

    // Navigate after animations and auth check
    const timer = setTimeout(() => {
      if (!loading) {
        if (isAuthenticated) {
          router.replace('/dashboard');
        } else {
          router.replace('/login');
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Medical Pattern Background */}
        <View style={styles.backgroundPattern}>
          <View style={[styles.medicalCross, styles.cross1]} />
          <View style={[styles.medicalCross, styles.cross2]} />
          <View style={[styles.heartbeat, styles.heartbeat1]} />
          <View style={[styles.heartbeat, styles.heartbeat2]} />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {/* Professional Logo Container */}
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['#DC2626', '#B91C1C']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logoEmoji}>🩸</Text>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Professional Typography */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.title}>BloodBank</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.subtitle}>Professional Blood Donation Platform</Text>
          </Animated.View>

          {/* Professional Tagline */}
          <Animated.View
            style={[
              styles.taglineContainer,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [0, 0, 1],
                }),
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.taglineText}>
              "Connecting donors with those in need"
            </Text>
            <Text style={styles.taglineSubtext}>
              Safe • Secure • Life-saving
            </Text>
          </Animated.View>

          {/* Professional Loading Animation */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ]}
          >
            <View style={styles.loadingBarContainer}>
              <View style={styles.loadingBarBackground}>
                <Animated.View
                  style={[
                    styles.loadingBar,
                    {
                      width: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.loadingText}>Initializing...</Text>
          </Animated.View>

          {/* Trust Indicators */}
          <Animated.View
            style={[
              styles.trustContainer,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 0.9, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ]}
          >
            <View style={styles.trustBadges}>
              <View style={styles.trustBadge}>
                <Text style={styles.trustIcon}>🛡️</Text>
                <Text style={styles.trustText}>Secure</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustIcon}>🏥</Text>
                <Text style={styles.trustText}>Medical Grade</Text>
              </View>
              <View style={styles.trustBadge}>
                <Text style={styles.trustIcon}>👥</Text>
                <Text style={styles.trustText}>Community</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Medical background pattern
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  medicalCross: {
    position: 'absolute',
    backgroundColor: '#E2E8F0',
    opacity: 0.3,
  },
  cross1: {
    width: 20,
    height: 60,
    top: '20%',
    right: '15%',
  },
  cross2: {
    width: 15,
    height: 45,
    top: '60%',
    left: '10%',
  },
  heartbeat: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#DC2626',
    opacity: 0.2,
  },
  heartbeat1: {
    width: 100,
    top: '25%',
    left: '20%',
  },
  heartbeat2: {
    width: 80,
    top: '75%',
    right: '25%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoWrapper: {
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#DC2626',
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  taglineText: {
    fontSize: 18,
    color: '#1E293B',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  taglineSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  loadingBarContainer: {
    width: '80%',
    marginBottom: 16,
  },
  loadingBarBackground: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  trustContainer: {
    alignItems: 'center',
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  trustBadge: {
    alignItems: 'center',
    gap: 8,
  },
  trustIcon: {
    fontSize: 20,
  },
  trustText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
