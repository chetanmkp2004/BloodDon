import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../src/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginScreen() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { login, loading, error, clearError } = useAuth();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      router.replace('/dashboard');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Professional Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <LinearGradient
                  colors={['#DC2626', '#B91C1C']}
                  style={styles.logoGradient}
                >
                  <Text style={styles.logoIcon}>🩸</Text>
                </LinearGradient>
              </View>
              <Text style={styles.appName}>BloodBank</Text>
              <Text style={styles.tagline}>Professional Blood Donation Platform</Text>
              <View style={styles.headerAccent} />
            </View>
          </View>

          {/* Professional Login Card */}
          <View style={styles.formContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>Sign in to your account</Text>
                <View style={styles.titleUnderline} />
              </View>
                
              {/* Professional Input Fields */}
              <View style={styles.inputSection}>
                {/* Username Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="person-outline" size={20} color="#64748B" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your username"
                      placeholderTextColor="#94A3B8"
                      value={formData.username}
                      onChangeText={(value) => handleInputChange('username', value)}
                      autoCapitalize="none"
                      autoComplete="username"
                    />
                  </View>
                  {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="#94A3B8"
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color="#64748B" 
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>
              </View>

              {/* Error Display */}
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color="#DC2626" />
                  <Text style={styles.errorMessage}>{error}</Text>
                </View>
              )}

              {/* Professional Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? ['#9CA3AF', '#6B7280'] : ['#DC2626', '#B91C1C']}
                  style={styles.loginButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Text>
                  {!loading && <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.buttonIcon} />}
                </LinearGradient>
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => Alert.alert('Info', 'Password reset functionality coming soon!')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.registerContainer}
              onPress={() => router.push('/register')}
              activeOpacity={0.7}
            >
              <Text style={styles.registerText}>
                Don't have an account?{' '}
                <Text style={styles.registerLink}>Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Professional Footer */}
          <View style={styles.footer}>
            <View style={styles.trustBadges}>
              <View style={styles.trustBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#059669" />
                <Text style={styles.trustText}>Secure Login</Text>
              </View>
              <View style={styles.trustBadge}>
                <Ionicons name="medical" size={16} color="#DC2626" />
                <Text style={styles.trustText}>Medical Grade</Text>
              </View>
              <View style={styles.trustBadge}>
                <Ionicons name="people" size={16} color="#2563EB" />
                <Text style={styles.trustText}>Trusted Platform</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    marginBottom: 16,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 28,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
  },
  headerAccent: {
    width: 40,
    height: 3,
    backgroundColor: '#DC2626',
    borderRadius: 2,
    marginTop: 8,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  formSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  titleUnderline: {
    width: 50,
    height: 2,
    backgroundColor: '#DC2626',
    borderRadius: 1,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    minHeight: 52,
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 0,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorMessage: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  registerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 16,
  },
  registerText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },
  registerLink: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 15,
  },
  footer: {
    paddingTop: 24,
    alignItems: 'center',
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
