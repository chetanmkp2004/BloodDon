import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // First, try to get cached user data for faster loading
      const cachedUser = await ApiService.getCachedUserData();
      if (cachedUser) {
        dispatch({ type: 'SET_USER', payload: cachedUser });
      }
      
      // Then verify authentication with backend
      const isAuth = await ApiService.isAuthenticated();
      
      if (isAuth) {
        try {
          const profile = await ApiService.getProfile();
          await ApiService.setCachedUserData(profile);
          dispatch({ type: 'SET_USER', payload: profile });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // If we have cached data, keep using it
          if (!cachedUser) {
            dispatch({ type: 'SET_USER', payload: null });
          }
        }
      } else {
        // Clear cached data if not authenticated
        await ApiService.setCachedUserData(null);
        dispatch({ type: 'SET_USER', payload: null });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await ApiService.login(credentials);
      
      // Get user profile after successful login
      const profile = await ApiService.getProfile();
      await ApiService.setCachedUserData(profile);
      dispatch({ type: 'SET_USER', payload: profile });
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific error types
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('Invalid credentials')) {
        errorMessage = 'Invalid username or password.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await ApiService.register(userData);
      
      // Auto-login after successful registration
      if (response.message === 'User registered successfully') {
        const loginResult = await login({
          username: userData.username,
          password: userData.password,
        });
        return loginResult;
      }
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle specific error types
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('already exists')) {
        errorMessage = 'Username or email already exists.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process...');
      // Try to call API logout first
      await ApiService.logout();
    } catch (error) {
      console.error('API logout failed, continuing with local logout:', error);
    }
    
    try {
      // Clear all tokens and cached data regardless of API call result
      await AsyncStorage.multiRemove([
        'access_token',
        'auth_token', 
        'refresh_token',
        'user_data'
      ]);
      await ApiService.setCachedUserData(null);
      console.log('Local storage cleared');
    } catch (storageError) {
      console.error('Storage cleanup failed:', storageError);
    }
    
    // Always dispatch logout to update the state
    dispatch({ type: 'LOGOUT' });
    console.log('Logout state updated');
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
