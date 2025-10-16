import { FC, useEffect, useState } from "react";
import { NewAppScreen } from "@react-native/new-app-screen";
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { User } from "./src/types/Auth";
import LoadingScreen from "./src/screens/LoadingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DetailedStatusScreen from "./src/screens/DetailedStatusScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import Navbar from "./src/components/Common/Navbar";
import DevicesScreen from "./src/screens/DevicesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import CarPlayScreen from "./src/screens/CarPlayScreen";

type Screen = 'home' | 'detailed' | 'devices' | 'settings';
type AuthScreen = 'login' | 'register' | 'forgot-password';

const App: FC = () => {
  
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [tireData] = useState([
    { id: '1', position: 'Front Left', pressure: 32, temperature: 25, status: 'normal' as const },
    { id: '2', position: 'Front Right', pressure: 31, temperature: 26, status: 'normal' as const },
    { id: '3', position: 'Rear Left', pressure: 28, temperature: 30, status: 'warning' as const },
    { id: '4', position: 'Rear Right', pressure: 29, temperature: 28, status: 'normal' as const },
  ]);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthScreen('login');
    setCurrentScreen('home');
  };

  // Initialize CarPlay screen
  useEffect(() => {
    // CarPlay functionality is now handled in CarPlayScreen component
    return () => {
      // Cleanup if needed
    };
  }, []);

  console.log('App.tsx - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <StatusBar barStyle='dark-content' backgroundColor='#f8f9fa' />
        <LoadingScreen message="Checking authentication..." />
      </SafeAreaView>
    );
  }

  console.log('App.tsx - About to check authentication. isAuthenticated:', isAuthenticated);
  if (!isAuthenticated) {
    console.log('App.tsx - Showing authentication screens');
    const renderAuthScreen = () => {
      switch (authScreen) {
        case 'login':
          return (
            <LoginScreen
              onLoginSuccess={() => {
                console.log('Login successful - setting authentication state');
                setIsAuthenticated(true);
                setUser({
                  id: '1',
                  email: 'demo@tstsmarttire.com',
                  name: 'Demo Driver',
                  role: 'user', // or 'admin' based on User type definition
                  lastLogin: new Date(),
                });
                setIsLoading(false);
              }}
              onNavigateToRegister={() => setAuthScreen('register')}
              onNavigateToForgotPassword={() => setAuthScreen('forgot-password')}
            />
          );
        case 'register':
          return (
            <RegisterScreen
              onRegisterSuccess={() => {
                // Registration success is handled by the useAuth hook
                console.log('Registration successful');
              }}
              onBackToLogin={() => setAuthScreen('login')}
            />
          );
        case 'forgot-password':
          return (
            <ForgotPasswordScreen
              onBackToLogin={() => setAuthScreen('login')}
            />
          );
        default:
          return (
            <LoginScreen
              onLoginSuccess={() => {
                console.log('Login successful');
              }}
              onNavigateToRegister={() => setAuthScreen('register')}
              onNavigateToForgotPassword={() => setAuthScreen('forgot-password')}
            />
          );
      }
    };

    return renderAuthScreen();
  }

  console.log('App.tsx - Showing main app screens');
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen frontLeft={tireData[0]} frontRight={tireData[1]} rearLeft={tireData[2]} rearRight={tireData[3]} />;
      case 'detailed':
        return <DetailedStatusScreen />;
      case 'devices':
        return <DevicesScreen />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      default:
        return <HomeScreen frontLeft={tireData[0]} frontRight={tireData[1]} rearLeft={tireData[2]} rearRight={tireData[3]} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* CarPlay Screen - Always active */}
      <CarPlayScreen />

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      {/* Custom Navbar */}
      <Navbar currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
