import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

type Screen = 'home' | 'detailed' | 'devices' | 'settings';

type NavbarProps = {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
};

const Navbar = ({ currentScreen, onScreenChange }: NavbarProps) => {
  const getTabIcon = (screen: Screen, isActive: boolean) => {
    let iconName: string;
    
    switch (screen) {
      case 'home':
        iconName = isActive ? 'home' : 'home-outline';
        break;
      case 'detailed':
        iconName = isActive ? 'bar-chart' : 'bar-chart-outline';
        break;
      case 'devices':
        iconName = isActive ? 'bluetooth' : 'bluetooth-outline';
        break;
      case 'settings':
        iconName = isActive ? 'settings' : 'settings-outline';
        break;
      default:
        iconName = 'help-outline';
    }
    
    return <Ionicons name={iconName} size={24} color={isActive ? '#007bff' : '#6c757d'} />;
  };

  const getTabLabel = (screen: Screen) => {
    switch (screen) {
      case 'home':
        return 'Overview';
      case 'detailed':
        return 'Detailed';
      case 'devices':
        return 'Devices';
      case 'settings':
        return 'Settings';
      default:
        return '';
    }
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.tabItem, currentScreen === 'home' && styles.activeTab]}
        onPress={() => onScreenChange('home')}
      >
        {getTabIcon('home', currentScreen === 'home')}
        <Text style={[styles.tabLabel, currentScreen === 'home' && styles.activeTabLabel]}>
          {getTabLabel('home')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, currentScreen === 'detailed' && styles.activeTab]}
        onPress={() => onScreenChange('detailed')}
      >
        {getTabIcon('detailed', currentScreen === 'detailed')}
        <Text style={[styles.tabLabel, currentScreen === 'detailed' && styles.activeTabLabel]}>
          {getTabLabel('detailed')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, currentScreen === 'devices' && styles.activeTab]}
        onPress={() => onScreenChange('devices')}
      >
        {getTabIcon('devices', currentScreen === 'devices')}
        <Text style={[styles.tabLabel, currentScreen === 'devices' && styles.activeTabLabel]}>
          {getTabLabel('devices')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, currentScreen === 'settings' && styles.activeTab]}
        onPress={() => onScreenChange('settings')}
      >
        {getTabIcon('settings', currentScreen === 'settings')}
        <Text style={[styles.tabLabel, currentScreen === 'settings' && styles.activeTabLabel]}>
          {getTabLabel('settings')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;