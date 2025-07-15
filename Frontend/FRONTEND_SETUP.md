# Blood Donation App - Frontend Setup

This is a React Native (Expo) application for the Blood Donation system.

## Prerequisites

- Node.js 18.x or later (see .nvmrc for exact version)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server:**
   ```bash
   npm start
   # or
   expo start
   ```

3. **Run on specific platform:**
   ```bash
   npm run android    # Android emulator/device
   npm run ios        # iOS simulator/device
   npm run web        # Web browser
   ```

## Key Dependencies

### Core Framework
- **Expo ~53.0.17** - React Native development platform
- **React Native 0.79.5** - Mobile app framework
- **Expo Router ~5.1.3** - File-based navigation

### UI & Navigation
- **@expo/vector-icons ^14.1.0** - Icon library
- **expo-linear-gradient ^14.1.5** - Gradient components
- **expo-blur ^14.1.5** - Blur effects
- **@react-native-picker/picker ^2.11.1** - Picker components

### Data & Storage
- **axios ^1.10.0** - HTTP client for API calls
- **@react-native-async-storage/async-storage ^2.2.0** - Local storage

### Development
- **TypeScript ~5.8.3** - Type safety
- **Jest ^29.2.1** - Testing framework

## Project Structure

```
Frontend/BloodBank/
├── app/                    # Expo Router screens
├── src/                    # Shared components and utilities
├── config/                 # Configuration files (API, etc.)
├── assets/                 # Images, fonts, etc.
└── components/             # Reusable UI components
```

## API Integration

The app connects to a Django REST API backend. Configure API endpoints in:
- `config/api.ts` - Main API configuration
- `src/api.js` - Authentication service

## Authentication

Uses JWT tokens with automatic refresh. Authentication state is managed through:
- `src/AuthContext.js` - React Context for auth state
- AsyncStorage for token persistence

## Development Commands

```bash
# Start development server
npm start

# Run tests
npm test

# Clear cache (if experiencing issues)
npx expo start --clear

# Install new dependencies
npm install <package-name>
expo install <expo-package-name>  # For Expo-specific packages
```

## Platform-Specific Notes

### iOS
- Requires Xcode and iOS Simulator
- Physical device requires Apple Developer account

### Android
- Requires Android Studio and Android SDK
- Can use Android Emulator or physical device with USB debugging

### Web
- Runs in any modern web browser
- Some React Native features may have limited support

## Troubleshooting

### Metro Bundle Issues
```bash
npx expo start --clear
rm -rf node_modules && npm install
```

### iOS Build Issues
```bash
cd ios && pod install && cd ..  # If using bare workflow
```

### Android Build Issues
```bash
cd android && ./gradlew clean && cd ..  # If using bare workflow
```

## Environment Variables

Create `.env` file for local configuration:
```
API_BASE_URL=http://localhost:8000/api
```
