# BloodBank - Blood Donation Mobile App

A modern, optimized React Native mobile application for blood donation management with professional UI/UX and robust authentication.

## ✨ Key Optimizations & Features

### 🎨 **Enhanced UI/UX Design**
- **Professional Medical Theme**: Red gradient color scheme with blood donation iconography
- **Responsive Design**: Optimized for all screen sizes with proper scaling
- **Modern Components**: Glass-morphism effects, smooth animations, and professional cards
- **Accessibility**: Proper contrast ratios and intuitive navigation

### 🔐 **Robust Authentication System**
- **Secure JWT Authentication**: Token-based authentication with refresh tokens
- **Form Validation**: Real-time client-side validation with error handling
- **Auto-logout**: Automatic logout on token expiration
- **Password Security**: Strong password requirements and secure storage

### 📱 **Optimized Screen Flow**
1. **Splash Screen**: Animated loading with brand identity
2. **Login Screen**: Clean, intuitive sign-in experience
3. **Registration Screen**: Comprehensive user onboarding
4. **Dashboard**: Feature-rich main interface with quick actions

### 🚀 **Performance Optimizations**
- **TypeScript Integration**: Type safety and better development experience
- **Efficient State Management**: Context API with reducers for optimal performance
- **Memory Management**: Proper cleanup and background task handling
- **Network Optimization**: Smart API calls with error handling and retry logic

### 🔧 **Technical Improvements**

#### **API Service (`src/api.js`)**
- Singleton pattern for consistent API management
- Automatic token refresh and handling
- Comprehensive error handling and logging
- Request/response interceptors for debugging

#### **Authentication Context (`src/AuthContext.js`)**
- Centralized authentication state management
- Automatic authentication persistence
- Error boundary handling
- Loading states management

#### **Screen Components**
- **Splash Screen**: Professional branding with smooth animations
- **Login Screen**: Form validation, password visibility toggle, error display
- **Register Screen**: Multi-field validation, responsive layout, auto-login
- **Dashboard Screen**: Statistics display, quick actions, emergency alerts

## 🛠️ **Technology Stack**

- **Frontend Framework**: React Native with Expo
- **Navigation**: Expo Router for file-based routing
- **State Management**: React Context API with useReducer
- **Styling**: StyleSheet with Linear Gradients
- **Icons**: Expo Vector Icons (Ionicons)
- **Storage**: AsyncStorage for token persistence
- **HTTP Client**: Fetch API with custom wrapper
- **Backend**: Django REST Framework (separate repository)

## 📦 **Dependencies**

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "expo-linear-gradient": "^14.1.5",
  "@expo/vector-icons": "^14.1.0",
  "expo-router": "~5.1.3",
  "react": "19.0.0",
  "react-native": "0.79.5"
}
```

## 🚀 **Getting Started**

1. **Install Dependencies**
   ```powershell
   npm install
   ```

2. **Start Development Server**
   ```powershell
   npm start
   ```

3. **Configure Backend**
   - Ensure Django backend is running on `http://127.0.0.1:8000`
   - Update API_BASE_URL in `src/api.js` if needed

## 📱 **App Features**

### **Authentication**
- User registration with validation
- Secure login with JWT tokens
- Password strength requirements
- Automatic session management

### **Dashboard**
- User profile display
- Donation statistics
- Quick action buttons
- Emergency blood alerts
- Motivational content

### **User Experience**
- Smooth animations and transitions
- Loading states and feedback
- Error handling with user-friendly messages
- Pull-to-refresh functionality

## 🏗️ **Project Structure**

```
BloodBank/
├── app/                    # Screen components
│   ├── splash.tsx         # Animated splash screen
│   ├── login.tsx          # Login form with validation
│   ├── register.tsx       # Registration form
│   ├── dashboard.tsx      # Main dashboard
│   └── _layout.tsx        # App navigation layout
├── src/                   # Utilities and services
│   ├── api.js            # API service singleton
│   └── AuthContext.js    # Authentication context
└── assets/               # Static assets
```

## 🎯 **Future Enhancements**

- **Donation Scheduling**: Calendar integration for appointments
- **Blood Bank Locator**: Map integration with nearby centers
- **Emergency Notifications**: Push notifications for urgent requests
- **Rewards System**: Gamification with badges and achievements
- **Social Features**: Community sharing and leaderboards
- **Health Tracking**: Integration with health monitoring

## 🔒 **Security Features**

- JWT token-based authentication
- Secure password hashing
- Auto-logout on token expiration
- Input sanitization and validation
- HTTPS-only API communication
- Secure storage of sensitive data

## 🌟 **Performance Metrics**

- **Fast Initial Load**: Optimized bundle size
- **Smooth Animations**: 60fps performance
- **Memory Efficient**: Proper cleanup and garbage collection
- **Network Optimized**: Minimal API calls with caching

---

**Built with ❤️ for the blood donation community**

*Every drop counts, every donor matters* 🩸
