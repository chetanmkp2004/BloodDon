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
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export default function RegisterScreen() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { register, loading, error, clearError } = useAuth();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.confirmPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
    };

    const result = await register(userData);
    
    if (result.success) {
      router.replace('/dashboard');
    } else {
      Alert.alert('Registration Failed', result.error);
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
          {/* Professional Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <View style={styles.backButtonContainer}>
                <Ionicons name="arrow-back" size={22} color="#DC2626" />
              </View>
            </TouchableOpacity>
            
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

          {/* Professional Registration Card */}
          <View style={styles.formContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.formTitle}>Create Your Account</Text>
                <Text style={styles.formSubtitle}>Join our community of life-savers</Text>
                <View style={styles.titleUnderline} />
              </View>
                
                {/* Professional Input Fields */}
                <View style={styles.inputSection}>
                  {/* Name Row */}
                  <View style={styles.nameRow}>
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>First Name</Text>
                      <View style={[styles.inputWrapper, errors.firstName && styles.inputError]}>
                        <View style={styles.inputIcon}>
                          <Ionicons name="person-outline" size={18} color="#64748B" />
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your first name"
                          placeholderTextColor="#94A3B8"
                          value={formData.firstName}
                          onChangeText={(value) => handleInputChange('firstName', value)}
                          autoCapitalize="words"
                        />
                      </View>
                      {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                    </View>

                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>Last Name</Text>
                      <View style={[styles.inputWrapper, errors.lastName && styles.inputError]}>
                        <View style={styles.inputIcon}>
                          <Ionicons name="person-outline" size={18} color="#64748B" />
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your last name"
                          placeholderTextColor="#94A3B8"
                          value={formData.lastName}
                          onChangeText={(value) => handleInputChange('lastName', value)}
                          autoCapitalize="words"
                        />
                      </View>
                      {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                    </View>
                  </View>

                  {/* Username Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
                      <View style={styles.inputIcon}>
                        <Ionicons name="at-outline" size={20} color="#64748B" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Choose a username"
                        placeholderTextColor="#94A3B8"
                        value={formData.username}
                        onChangeText={(value) => handleInputChange('username', value)}
                        autoCapitalize="none"
                        autoComplete="username"
                      />
                    </View>
                    {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                      <View style={styles.inputIcon}>
                        <Ionicons name="mail-outline" size={20} color="#64748B" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email address"
                        placeholderTextColor="#94A3B8"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
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
                        placeholder="Create a strong password"
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

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                      <View style={styles.inputIcon}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#64748B" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm your password"
                        placeholderTextColor="#94A3B8"
                        value={formData.confirmPassword}
                        onChangeText={(value) => handleInputChange('confirmPassword', value)}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons 
                          name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                          size={20} 
                          color="#64748B" 
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                  </View>
                </View>

                {/* Error Display */}
                {error && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={20} color="#DC2626" />
                    <Text style={styles.errorMessage}>{error}</Text>
                  </View>
                )}

                {/* Professional Register Button */}
                <TouchableOpacity
                  style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={loading ? ['#9CA3AF', '#6B7280'] : ['#DC2626', '#B91C1C']}
                    style={styles.registerButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.registerButtonText}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                    {!loading && <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.buttonIcon} />}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Terms and Privacy */}
                <View style={styles.legalContainer}>
                  <Text style={styles.legalText}>
                    By creating an account, you agree to our{'\n'}
                    <Text style={styles.legalLink}>Terms of Service</Text> and <Text style={styles.legalLink}>Privacy Policy</Text>
                  </Text>
                </View>

              {/* Login Link */}
              <TouchableOpacity
                style={styles.loginContainer}
                onPress={() => router.push('/login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.loginLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Professional Footer */}
          <View style={styles.footer}>
            <View style={styles.trustBadges}>
              <View style={styles.trustBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#059669" />
                <Text style={styles.trustText}>Secure & Private</Text>
              </View>
              <View style={styles.trustBadge}>
                <Ionicons name="medical" size={16} color="#DC2626" />
                <Text style={styles.trustText}>Medical Grade</Text>
              </View>
              <View style={styles.trustBadge}>
                <Ionicons name="people" size={16} color="#2563EB" />
                <Text style={styles.trustText}>Community Driven</Text>
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
    paddingVertical: 30,
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
    marginBottom: 32,
    position: 'relative',
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    zIndex: 10,
  },
  backButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 28,
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
    padding: 24,
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
    marginBottom: 28,
  },
  formTitle: {
    fontSize: 24,
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
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
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
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  legalContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  legalText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '400',
  },
  legalLink: {
    color: '#DC2626',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  loginText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },
  loginLink: {
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
