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
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { isAuthenticated, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    const startAnimations = () => {
      if (lottieRef.current) {
        lottieRef.current.play();
      }
      
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
        {/* Animated Background Elements */}
        <Animated.View style={[styles.backgroundCircle, styles.circle1, {
          opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.1],
          })
        }]} />
        <Animated.View style={[styles.backgroundCircle, styles.circle2, {
          opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.15],
          })
        }]} />

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
          {/* Logo with Lottie Animation */}
          <View style={styles.logoContainer}>
            <Animated.View style={[styles.logoWrapper]}>
              <View style={styles.bloodDropContainer}>
                <Animated.View 
                  style={[
                    styles.bloodDrop,
                    {
                      transform: [
                        { 
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.8, 1.1, 1]
                          }) 
                        }
                      ],
                      opacity: fadeAnim
                    }
                  ]} 
                />
                <Animated.View 
                  style={[
                    styles.bloodRipple,
                    {
                      opacity: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 0.8]
                      }),
                      transform: [
                        { 
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.6, 1.5]
                          }) 
                        }
                      ]
                    }
                  ]} 
                />
                <Animated.View 
                  style={[
                    styles.bloodShine,
                    {
                      opacity: fadeAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.7, 0]
                      }),
                      transform: [
                        { 
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-40, 40]
                          }) 
                        }
                      ]
                    }
                  ]} 
                />
              </View>
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

          {/* Enhanced Loading Animation */}
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
              <Animated.View 
                style={[
                  styles.trustBadge,
                  {
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0.8, 1],
                        outputRange: [20, 0],
                        extrapolate: 'clamp'
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.trustIcon}>🛡️</Text>
                <Text style={styles.trustText}>Secure</Text>
              </Animated.View>
              <Animated.View 
                style={[
                  styles.trustBadge,
                  {
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0.85, 1],
                        outputRange: [20, 0],
                        extrapolate: 'clamp'
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.trustIcon}>🏥</Text>
                <Text style={styles.trustText}>Medical Grade</Text>
              </Animated.View>
              <Animated.View 
                style={[
                  styles.trustBadge,
                  {
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0.9, 1],
                        outputRange: [20, 0],
                        extrapolate: 'clamp'
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.trustIcon}>👥</Text>
                <Text style={styles.trustText}>Community</Text>
              </Animated.View>
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
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#DC2626',
  },
  circle1: {
    width: width * 1.2,
    height: width * 1.2,
    top: -width * 0.6,
    left: -width * 0.3,
  },
  circle2: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.4,
    right: -width * 0.2,
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
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodDropContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodDrop: {
    width: 60,
    height: 80,
    backgroundColor: '#DC2626',
    borderRadius: 30,
    position: 'absolute',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bloodRipple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#DC2626',
    backgroundColor: 'transparent',
  },
  bloodShine: {
    position: 'absolute',
    width: 20,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    opacity: 0.3,
    top: 15,
    left: 20,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
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