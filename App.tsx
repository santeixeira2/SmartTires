import { FC, useEffect, useState } from "react";
import { NewAppScreen } from "@react-native/new-app-screen";
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, View, LogBox } from "react-native";

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs([
  'Warning:',
  'Error:',
  'Remote debugger',
  'VirtualizedLists should never be nested',
  'Require cycle:',
  'Non-serializable values were found in the navigation state',
]);
import { User } from "./src/types/Auth";
import LoadingScreen from "./src/screens/LoadingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DetailedStatusScreen from "./src/screens/DetailedStatusScreen";
import TireDetailScreen from "./src/screens/TireDetailScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import Navbar from "./src/components/Common/Navbar";
import DevicesScreen from "./src/screens/DevicesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import CarPlayScreen from "./src/screens/CarPlayScreen";
import { AppProvider, useAppStore, useAppActions } from "./src/store/AppStore";
import vehiclesData from "./src/data/vehicles.json";

type Screen = 'home' | 'detailed' | 'tire-detail' | 'devices' | 'settings';
type AuthScreen = 'login' | 'register' | 'forgot-password';

const AppContent: FC = () => {
  const { state } = useAppStore();
  const { setVehiclesData, clearAllData, setSelectedVehicle } = useAppActions();
  
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Remove hardcoded tireData - HomeScreen will load from store
  
  const [focusedTire, setFocusedTire] = useState<{tireId: string, vehicleName: string} | null>(null);
  const [tireDetailData, setTireDetailData] = useState<{tireId: string, vehicleName: string} | null>(null);

  useEffect(() => {
    console.log('✅ App initialized - checking for user data');
    if (state.vehiclesData.length === 0) {
      console.log('No user data found, loading default vehicles');
      setVehiclesData(vehiclesData as any[]);
    } else {
      console.log('User data found, using registered vehicles:', state.vehiclesData);
    }
  }, [state.vehiclesData.length]); // Only run when vehiclesData changes

  const handleLogout = () => {
    clearAllData();
    console.log('✅ Store cleared on logout');
    
    setIsAuthenticated(false);
    setUser(null);
    setAuthScreen('login');
    setCurrentScreen('home');
    setFocusedTire(null);
  };

  const handleTireNavigation = (tireId: string, vehicleName: string) => {
    console.log(`🔥 App.tsx - Tire navigation: ${tireId} on ${vehicleName}`);
    setFocusedTire({ tireId, vehicleName });
    setCurrentScreen('detailed');
  };

  const handleTireDetailNavigation = (tireId: string, vehicleName: string) => {
    console.log(`🔥 App.tsx - Tire detail navigation: ${tireId} on ${vehicleName}`);
    setTireDetailData({ tireId, vehicleName });
    setCurrentScreen('tire-detail');
  };

  const handleBackFromTireDetail = () => {
    setCurrentScreen('detailed');
    setTireDetailData(null);
  };

  useEffect(() => {
    return () => {
    };
  }, []);

  console.log('App.tsx - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);
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
                console.log('Registration successful - redirecting to home');
                setIsAuthenticated(true);
                setUser({
                  id: '1',
                  email: 'demo@tstsmarttire.com',
                  name: 'Demo Driver',
                  role: 'user',
                  lastLogin: new Date(),
                });
                setIsLoading(false);
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
        return (
          <HomeScreen 
            onNavigateToDetailed={handleTireNavigation}
          />
        );
      case 'detailed':
        return (
          <DetailedStatusScreen 
            focusedTire={focusedTire?.tireId}
            vehicleName={focusedTire?.vehicleName}
            vehiclesData={state.vehiclesData}
            onNavigateToTireDetail={handleTireDetailNavigation}
          />
        );
      case 'tire-detail':
        return (
          <TireDetailScreen 
            tireId={tireDetailData?.tireId || ''}
            vehicleName={tireDetailData?.vehicleName || ''}
            onBack={handleBackFromTireDetail}
          />
        );
      case 'devices':
        return <DevicesScreen />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      default:
        return (
          <HomeScreen 
            onNavigateToDetailed={handleTireNavigation}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <CarPlayScreen />
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      <Navbar currentScreen={currentScreen as any} onScreenChange={setCurrentScreen as any} />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App: FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
