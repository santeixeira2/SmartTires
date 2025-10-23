import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../../components/Common/Header';
import { TireData } from '../../components/Vehicle/TireCard';
import { useAppStore } from '../../store/AppStore';

interface TireDetailScreenProps {
  tireId: string;
  vehicleName: string;
  onBack: () => void;
}

const TireDetailScreen: React.FC<TireDetailScreenProps> = ({ tireId, vehicleName, onBack }) => {
  const { state } = useAppStore();
  const [tireData, setTireData] = useState<TireData | null>(null);
  const [tireHistory, setTireHistory] = useState<Array<{
    timestamp: string;
    pressure: number;
    temperature: number;
    status: string;
  }>>([]);

  // Find the tire data from the selected vehicle
  useEffect(() => {
    const selectedVehicle = state.vehiclesData.find(v => v.id === state.selectedVehicleId);
    console.log('TireDetailScreen - selectedVehicle:', selectedVehicle);
    console.log('TireDetailScreen - tireId:', tireId);
    console.log('TireDetailScreen - registrationData:', state.registrationData);
    
    if (selectedVehicle && selectedVehicle.tireData) {
      // The tireData is an object with position keys, not an array
      // Convert tireId to position key (e.g., "1" -> "front-left", "2" -> "front-right")
      const positionKeys = Object.keys(selectedVehicle.tireData);
      const tirePosition = positionKeys[parseInt(tireId) - 1]; // tireId is 1-based, array is 0-based
      
      console.log('TireDetailScreen - positionKeys:', positionKeys);
      console.log('TireDetailScreen - tirePosition:', tirePosition);
      
      if (tirePosition && selectedVehicle.tireData[tirePosition]) {
        const tireInfo = selectedVehicle.tireData[tirePosition];
        console.log('TireDetailScreen - found tire info:', tireInfo);
        
        // Get sensor ID from registration data
        let sensorId = `device_${tireId}`; // fallback
        console.log('TireDetailScreen - registrationData:', state.registrationData);
        console.log('TireDetailScreen - vehicleSensorIds:', state.registrationData?.vehicleSensorIds);
        console.log('TireDetailScreen - selectedVehicle.id:', selectedVehicle.id);
        console.log('TireDetailScreen - tirePosition:', tirePosition);
        console.log('TireDetailScreen - tireId:', tireId);
        
        // Try to find sensor ID with different key structures
        const vehicleSensorIds = state.registrationData?.vehicleSensorIds?.[selectedVehicle.id];
        if (vehicleSensorIds) {
          console.log('TireDetailScreen - vehicleSensorIds for this vehicle:', vehicleSensorIds);
          
          // Try with tire position key (e.g., 'front-left')
          if (vehicleSensorIds[tirePosition]) {
            sensorId = vehicleSensorIds[tirePosition];
            console.log('TireDetailScreen - found sensor ID by position:', sensorId);
          }
          // Try with tire ID key (e.g., '1', '2')
          else if (vehicleSensorIds[tireId]) {
            sensorId = vehicleSensorIds[tireId];
            console.log('TireDetailScreen - found sensor ID by tireId:', sensorId);
          }
          // Try with tire position from tireId mapping
          else {
            const tireIdToPosition: {[key: string]: string} = {
              '1': 'front-left',
              '2': 'front-right', 
              '3': 'rear-left',
              '4': 'rear-right',
              '5': 'middle-left',
              '6': 'middle-right',
              '7': 'rear-left-2',
              '8': 'rear-right-2',
              '9': 'front-left-2',
              '10': 'front-right-2',
              '11': 'middle-left-2',
              '12': 'middle-right-2',
            };
            const mappedPosition = tireIdToPosition[tireId];
            if (mappedPosition && vehicleSensorIds[mappedPosition]) {
              sensorId = vehicleSensorIds[mappedPosition];
              console.log('TireDetailScreen - found sensor ID by mapped position:', sensorId);
            } else {
              console.log('TireDetailScreen - sensor ID not found with any key, using fallback:', sensorId);
            }
          }
        } else {
          console.log('TireDetailScreen - no vehicleSensorIds for this vehicle, using fallback:', sensorId);
        }
        
        // Convert to TireData format
        const tire: TireData = {
          id: parseInt(tireId),
          pressure: tireInfo.psi,
          temperature: tireInfo.temp,
          connected: true,
          deviceId: sensorId, // Use actual sensor ID
          position: tirePosition,
        };
        
        setTireData(tire);
        
        // Generate mock history data
        const history = [];
        for (let i = 0; i < 10; i++) {
          const date = new Date();
          date.setHours(date.getHours() - i * 2);
          history.push({
            timestamp: date.toISOString(),
            pressure: tire.pressure + (Math.random() - 0.5) * 2,
            temperature: tire.temperature + (Math.random() - 0.5) * 3,
            status: tire.pressure < 28 ? 'Low Pressure' : tire.pressure > 35 ? 'High Pressure' : 'Normal'
          });
        }
        setTireHistory(history);
      } else {
        console.log('TireDetailScreen - tire position not found, generating mock data');
        // Generate mock tire data if position not found
        const mockTire = {
          id: parseInt(tireId),
          pressure: 30 + Math.random() * 5,
          temperature: 20 + Math.random() * 10,
          connected: true,
          deviceId: `device_${tireId}`,
          position: `tire_${tireId}`,
        };
        setTireData(mockTire);
        
        const history = [];
        for (let i = 0; i < 10; i++) {
          const date = new Date();
          date.setHours(date.getHours() - i * 2);
          history.push({
            timestamp: date.toISOString(),
            pressure: mockTire.pressure + (Math.random() - 0.5) * 2,
            temperature: mockTire.temperature + (Math.random() - 0.5) * 3,
            status: mockTire.pressure < 28 ? 'Low Pressure' : mockTire.pressure > 35 ? 'High Pressure' : 'Normal'
          });
        }
        setTireHistory(history);
      }
    } else {
      console.log('TireDetailScreen - no selected vehicle or tireData found, generating mock data');
      // Generate mock tire data if no vehicle or tireData
      const mockTire = {
        id: parseInt(tireId),
        pressure: 30 + Math.random() * 5,
        temperature: 20 + Math.random() * 10,
        connected: true,
        deviceId: `device_${tireId}`,
        position: `tire_${tireId}`,
      };
      setTireData(mockTire);
      
      const history = [];
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setHours(date.getHours() - i * 2);
        history.push({
          timestamp: date.toISOString(),
          pressure: mockTire.pressure + (Math.random() - 0.5) * 2,
          temperature: mockTire.temperature + (Math.random() - 0.5) * 3,
          status: mockTire.pressure < 28 ? 'Low Pressure' : mockTire.pressure > 35 ? 'High Pressure' : 'Normal'
        });
      }
      setTireHistory(history);
    }
  }, [tireId, state.vehiclesData, state.selectedVehicleId, state.registrationData]);

  const getTirePosition = (tireId: string): string => {
    const positions: {[key: string]: string} = {
      '1': 'Front Left',
      '2': 'Front Right', 
      '3': 'Rear Left',
      '4': 'Rear Right',
      '5': 'Middle Left',
      '6': 'Middle Right',
      '7': 'Rear Left 2',
      '8': 'Rear Right 2',
      '9': 'Front Left 2',
      '10': 'Front Right 2',
      '11': 'Middle Left 2',
      '12': 'Middle Right 2',
    };
    return positions[tireId] || `Tire ${tireId}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Normal': return '#28a745';
      case 'Low Pressure': return '#ffc107';
      case 'High Pressure': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!tireData) {
    return (
      <View style={styles.container}>
        <Header 
          title="Tire Detail" 
          subtitle={`${getTirePosition(tireId)} - ${vehicleName}`}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Tire data not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Tire Detail" 
        subtitle={`${getTirePosition(tireId)} - ${vehicleName}`}
      />
      
      <ScrollView style={styles.content}>
        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Current Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Pressure</Text>
              <Text style={[styles.statusValue, { color: getStatusColor(tireData.pressure < 28 ? 'Low Pressure' : tireData.pressure > 35 ? 'High Pressure' : 'Normal') }]}>
                {tireData.pressure.toFixed(1)} PSI
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Temperature</Text>
              <Text style={styles.statusValue}>
                {tireData.temperature.toFixed(1)}°C
              </Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Connection</Text>
              <Text style={[styles.statusValue, { color: tireData.connected ? '#28a745' : '#dc3545' }]}>
                {tireData.connected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Device ID</Text>
              <Text style={styles.statusValue}>
                {tireData.deviceId}
              </Text>
            </View>
          </View>
        </View>

        {/* History Card */}
        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>Pressure & Temperature History</Text>
          <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
            {tireHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyTime}>{formatTimestamp(entry.timestamp)}</Text>
                  <Text style={[styles.historyStatus, { color: getStatusColor(entry.status) }]}>
                    {entry.status}
                  </Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyPressure}>{entry.pressure.toFixed(1)} PSI</Text>
                  <Text style={styles.historyTemperature}>{entry.temperature.toFixed(1)}°C</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tire Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Tire Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Position:</Text>
            <Text style={styles.infoValue}>{getTirePosition(tireId)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle:</Text>
            <Text style={styles.infoValue}>{vehicleName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6c757d',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  historyList: {
    maxHeight: 200,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  historyLeft: {
    flex: 1,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  historyPressure: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  historyTemperature: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
  },
});

export default TireDetailScreen;
