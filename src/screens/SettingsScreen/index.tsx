import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Header from '../../components/Common/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store/AppStore';
import styles from './styles';

interface SettingsScreenProps {
  onLogout?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  const { state } = useAppStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);
  const [units, setUnits] = useState('imperial');
  const { user } = useAuth();

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        {
          text: 'Cancel', 
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setNotificationsEnabled(true);
            setAutoConnect(false);
            setUnits('imperial');
            setIsDarkMode(false);
            Alert.alert('Settings Reset', 'All settings have been reset to default');
          }
        }
      ]
    )
  }

  const handleExportData = () => {
    Alert.alert('Export Data', 'This feature will be available in a future update');
  }

  const handleAbout = () => {
    Alert.alert(
      'About TST Smart Tire',
      'TST Smart Tire v1.0.0\n\nA real-time tire monitoring application for commercial vehicles.\n\nDeveloped with React Native v0.76.0.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Settings" subtitle="Configure your TST Smart Tire app" />

      {/* User Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <View style={styles.userInfoContainer}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={24} color="#007bff" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <Text style={styles.userRole}>{user?.role || 'Driver'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Logout</Text>
            <Text style={styles.settingDescription}>
              Sign out of your account
            </Text>
          </View>
          <Ionicons name="log-out-outline" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive alerts for low tire pressure and high temperature
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Connection Section
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto-Connect</Text>
            <Text style={styles.settingDescription}>
              Automatically connect to previously paired devices
            </Text>
          </View>
          <Switch
            value={autoConnect}
            onValueChange={setAutoConnect}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={autoConnect ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View> */}

      {/* Display Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use dark theme for better visibility in low light
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Units Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Units</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setUnits(units === 'imperial' ? 'metric' : 'imperial')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Measurement Units</Text>
            <Text style={styles.settingDescription}>
              Current: {units === 'imperial' ? 'PSI / °F' : 'kPa / °C'}
            </Text>
          </View>
          <Text style={styles.settingValue}>
            {units === 'imperial' ? 'Imperial' : 'Metric'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Data Management Section
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Export Data</Text>
            <Text style={styles.settingDescription}>
              Export tire data and settings
            </Text>
          </View>
          <Text style={styles.settingValue}>Export</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleResetSettings}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Reset Settings</Text>
            <Text style={styles.settingDescription}>
              Reset all settings to default values
            </Text>
          </View>
          <Text style={[styles.settingValue, styles.dangerText]}>Reset</Text>
        </TouchableOpacity>
      </View> */}

      {/* Registration Data Section */}
      {state.registrationData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registration Data</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>User</Text>
              <Text style={styles.settingDescription}>
                {state.registrationData.user.name} ({state.registrationData.user.email})
              </Text>
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Main Vehicle</Text>
              <Text style={styles.settingDescription}>
                {state.registrationData.vehicle.name} ({state.registrationData.vehicle.axleType})
              </Text>
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vehicles Registered</Text>
              <Text style={styles.settingDescription}>
                {state.vehiclesData.length} vehicle(s) • {state.registrationData.syncStatus.syncedCount} synced
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>App Information</Text>
            <Text style={styles.settingDescription}>
              Version, developer info, and support
            </Text>
          </View>
          <Text style={styles.settingValue}>Info</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default SettingsScreen;