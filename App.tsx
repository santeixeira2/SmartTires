import { FC, useEffect, useState } from "react";
import { NewAppScreen } from "@react-native/new-app-screen";
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { CarPlay, ListTemplate, MapTemplate, MapTemplateConfig, PushableTemplates, TabBarTemplate } from "react-native-carplay";
import uuid from 'react-native-uuid'
import LoadingScreen from "./src/screens/LoadingScreen";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";

type Screen = 'home' | 'vehicleDetails' | 'devices' | 'settings';
type AuthScreen =  'login' | 'register' | 'forgotPassword'; 

const App: FC = () => {
  const isDarkMode = useColorScheme() === "dark";

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentAuthScreen, setCurrentAuthScreen] = useState<AuthScreen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState< any | null>(null);

  const [tireData] = useState([
    { id: '1', position: 'Front Left', pressure: 32, temperature: 25, status: 'normal' as const },
    { id: '2', position: 'Front Right', pressure: 31, temperature: 26, status: 'normal' as const },
    { id: '3', position: 'Rear Left', pressure: 28, temperature: 30, status: 'warning' as const },
    { id: '4', position: 'Rear Right', pressure: 29, temperature: 28, status: 'normal' as const },
  ]);

  // Debugging
  console.log('App.tsx - isAuthenticated', isAuthenticated, 'isLoading', isLoading, 'user', user);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa'}}>
        <StatusBar barStyle='dark-content' backgroundColor='#f8f9fa'/>
        <LoadingScreen message='Checking Authentication' />
      </SafeAreaView>
    )
  }

  const buffers = Platform.OS === 'android'
    ? {
      maxCacheSize: 50 * 1024, // 50MB cache
      maxBuffer: 30,
      playBuffer: 2.5,
      backBuffer: 5
    } : {};

  console.log('App.tsx - buffers', buffers);
  console.log('App.tsx - Platform.OS', Platform.OS);

  console.log('App.tsx - About to check authentication status', isAuthenticated);
  if(!isAuthenticated) {
    console.log('App.tsx - Showing authentication screens');
    const renderAuthScreen = () => {
      switch (currentAuthScreen) {
        case 'login':
          return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} 
            onNavigateToRegister={() => setCurrentAuthScreen('register')} 
            onNavigateToForgotPassword={() => setCurrentAuthScreen('forgotPassword')} 
          />;
        // case 'register':
        //   return <RegisterContainer onRegisterSuccess={() => setIsAuthenticated(true)} onNavigateToLogin={() => setCurrentAuthScreen('login')} />;
        // case 'forgotPassword':
        //   return <ForgotPasswordContainer onForgotPasswordSuccess={() => setIsAuthenticated(true)} onNavigateToLogin={() => setCurrentAuthScreen('login')} />;
        default:
          return (
            <LoginScreen 
              onLoginSuccess={() => setIsAuthenticated(true)} 
              onNavigateToRegister={() => setCurrentAuthScreen('register')} 
              onNavigateToForgotPassword={() => setCurrentAuthScreen('forgotPassword')} 
            />
          );
      }
    };
    return renderAuthScreen();
  }

  useEffect(() => {
    CarPlay.registerOnConnect(() => {
      console.log("CarPlay connected");

      const template: PushableTemplates | TabBarTemplate = new TabBarTemplate({
        id: uuid.v4(),
        title: "Tabs",
        templates: [
          RootTemplate,
          CarPlayMoreTemplate,
        ],
        onTemplateSelect() { },
      })

      CarPlay.setRootTemplate(template);
    });

    CarPlay.registerOnDisconnect(() => {
      console.log('CarPlay disconnected');
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa'}}>
      <StatusBar barStyle='dark-content' backgroundColor='#f8f9fa'/>
      <HomeScreen />
    </SafeAreaView>
  );
};

const RootTemplate =
  new ListTemplate({
    id: uuid.v4(),
    title: 'Home',
    tabTitle: 'Home',
    tabSystemImageName: 'music.house.fill',
    sections: [
      {
        header: `Hi`,
        items: [],
      },
      {
        header: "Section 1",
        items: [
          { id: "list1", text: "Show Map" },
        ],
      },
      {
        header: 'Section 1',
        items: [
          { id: "list1", text: "List1" },
          { id: "list2", text: "List2" },
        ],
      },
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.debug(`Home item selected`)
      if (index === 0) return showMapTemplate();

      CarPlay.pushTemplate(RandomTemplate(templateId));
    },
  });

const CarPlayMoreTemplate = new ListTemplate({
  id: uuid.v4(),
  tabTitle: "More",
  tabSystemImageName: 'globe',
});

const RandomTemplate = (key: string) =>
  new ListTemplate({
    id: uuid.v4(),
    sections: [
      {
        items:
          Array(10)?.fill(null).map((item, index) => {
            return {
              id: index?.toString(),
              text: `${key} - ${index}`,
            }
          }) ?? [],
      },
    ],
    onItemSelect: async (item) => { },
  });

const showMapTemplate = (): void => {
  const mapConfig: MapTemplateConfig = {
    component: MapView,
    tripEstimateStyle: "dark",
    guidanceBackgroundColor: '#eeff00',
  };

  const mapTemplate = new MapTemplate(mapConfig);

  CarPlay.pushTemplate(mapTemplate, false);
}

const MapView = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require("./src/assets/images/map.png")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
