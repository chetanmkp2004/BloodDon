import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  async makeRequest(endpoint, options = {}) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const token = await AsyncStorage.getItem('access_token');
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
          },
          timeout: 10000, // 10 second timeout
          ...options,
        };

        console.log(`Making request to: ${API_BASE_URL}${endpoint} (attempt ${attempt + 1})`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...config,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          throw new Error('Invalid server response');
        }

        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (!response.ok) {
          // If unauthorized and we have a refresh token, try to refresh
          if (response.status === 401 && endpoint !== '/token/refresh/' && endpoint !== '/login/') {
            try {
              await this.refreshToken();
              // Retry the original request with new token
              return this.makeRequest(endpoint, options);
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              throw new Error('Session expired. Please login again.');
            }
          }
          
          throw new Error(data.message || data.error || data.detail || `HTTP error! status: ${response.status}`);
        }

        return data;
      } catch (error) {
        attempt++;
        console.error(`API request failed (attempt ${attempt}):`, error);
        
        // If it's the last attempt or specific errors, don't retry
        if (attempt >= maxRetries || 
            error.message.includes('Session expired') || 
            error.message.includes('Invalid server response') ||
            error.name === 'AbortError') {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async register(userData) {
    return this.makeRequest('/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.makeRequest('/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.access) {
      await AsyncStorage.setItem('access_token', response.access);
      await AsyncStorage.setItem('refresh_token', response.refresh);
    }

    return response;
  }

  async logout() {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
  }

  async getProfile() {
    return this.makeRequest('/profile/');
  }

  async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.makeRequest('/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.access) {
        await AsyncStorage.setItem('access_token', response.access);
      }

      return response;
    } catch (error) {
      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  }

  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return false;
      
      // Optionally verify token validity with backend
      try {
        await this.getProfile();
        return true;
      } catch (error) {
        // If profile request fails, token might be invalid
        console.log('Token validation failed, clearing storage');
        await this.logout();
        return false;
      }
    } catch {
      return false;
    }
  }

  // Network connectivity check
  async checkConnectivity() {
    try {
      const response = await fetch(`${API_BASE_URL}/health/`, {
        method: 'GET',
        timeout: 5000,
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get cached user data
  async getCachedUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Cache user data
  async setCachedUserData(userData) {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to cache user data:', error);
    }
  }
}

export default new ApiService();
