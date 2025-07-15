import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - Update this to match your Django server
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData: any) => api.post('/auth/register/', userData),
  login: (credentials: any) => api.post('/auth/login/', credentials),
  refreshToken: (refreshToken: string) => 
    api.post('/auth/token/refresh/', { refresh: refreshToken }),
  logout: () => api.post('/auth/logout/'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (data: any) => api.put('/profile/', data),
  getMedicalInfo: () => api.get('/medical-info/'),
  updateMedicalInfo: (data: any) => api.put('/medical-info/', data),
};

export const medicalAPI = {
  // Allergies
  getAllergies: () => api.get('/allergies/'),
  addAllergy: (data: any) => api.post('/allergies/', data),
  updateAllergy: (id: number, data: any) => api.put(`/allergies/${id}/`, data),
  deleteAllergy: (id: number) => api.delete(`/allergies/${id}/`),
  
  // Medications
  getMedications: () => api.get('/medications/'),
  addMedication: (data: any) => api.post('/medications/', data),
  updateMedication: (id: number, data: any) => api.put(`/medications/${id}/`, data),
  deleteMedication: (id: number) => api.delete(`/medications/${id}/`),
  
  // Medical Conditions
  getConditions: () => api.get('/medical-conditions/'),
  addCondition: (data: any) => api.post('/medical-conditions/', data),
  updateCondition: (id: number, data: any) => api.put(`/medical-conditions/${id}/`, data),
  deleteCondition: (id: number) => api.delete(`/medical-conditions/${id}/`),
};

export const donationAPI = {
  // Donation Centers
  getDonationCenters: () => api.get('/donation-centers/'),
  getDonationCenter: (id: number) => api.get(`/donation-centers/${id}/`),
  
  // Donations
  getDonations: () => api.get('/donations/'),
  scheduleDonation: (data: any) => api.post('/donations/', data),
  updateDonation: (id: number, data: any) => api.put(`/donations/${id}/`, data),
  cancelDonation: (id: number) => api.delete(`/donations/${id}/`),
  
  // Appointments
  getAppointments: () => api.get('/appointments/'),
  scheduleAppointment: (data: any) => api.post('/appointments/', data),
  updateAppointment: (id: number, data: any) => api.put(`/appointments/${id}/`, data),
  cancelAppointment: (id: number) => api.delete(`/appointments/${id}/`),
};

export const emergencyAPI = {
  getEmergencyRequests: () => api.get('/emergency-requests/'),
  getEmergencyRequest: (id: number) => api.get(`/emergency-requests/${id}/`),
  respondToEmergency: (requestId: number, data: any) => 
    api.post(`/emergency-requests/${requestId}/respond/`, data),
  getMyEmergencyResponses: () => api.get('/emergency-responses/'),
  updateEmergencyResponse: (id: number, data: any) => 
    api.put(`/emergency-responses/${id}/`, data),
};

export default api;
