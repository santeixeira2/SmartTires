import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import TruckTopDownView from './TruckTopDownView';

// Example component showing different ways to use touchable tires
const TireInteractionExample: React.FC = () => {
  const [selectedTire, setSelectedTire] = useState<string | null>(null);

  // Example 1: Simple tire selection
  const handleTirePress = (tireId: string) => {
    setSelectedTire(tireId);
    Alert.alert('Tire Selected', `You selected: ${tireId}`);
  };

  // Example 2: Navigate to tire details
  const handleTireDetails = (tireId: string) => {
    Alert.alert(
      'Tire Options',
      `What would you like to do with ${tireId} tire?`,
      [
        { text: 'View Details', onPress: () => console.log('Navigate to tire details') },
        { text: 'Sync Sensor', onPress: () => console.log('Open QR scanner for this tire') },
        { text: 'Settings', onPress: () => console.log('Open tire settings') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Example 3: Show tire status
  const handleTireStatus = (tireId: string) => {
    const status = selectedTire === tireId ? 'Selected' : 'Normal';
    Alert.alert('Tire Status', `${tireId}: ${status}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Touchable Tires Examples</Text>
      
      {/* Example 1: Basic tire selection */}
      <View style={styles.example}>
        <Text style={styles.exampleTitle}>1. Basic Selection</Text>
        <TruckTopDownView 
          frontLeft={{ psi: 32, temp: 25 }}
          frontRight={{ psi: 31, temp: 26 }}
          rearLeft={{ psi: 28, temp: 30 }}
          rearRight={{ psi: 29, temp: 28 }}
          onTirePress={handleTirePress}
        />
        {selectedTire && (
          <Text style={styles.selectedText}>Selected: {selectedTire}</Text>
        )}
      </View>

      {/* Example 2: Tire options */}
      <View style={styles.example}>
        <Text style={styles.exampleTitle}>2. Tire Options</Text>
        <TruckTopDownView 
          frontLeft={{ psi: 32, temp: 25 }}
          frontRight={{ psi: 31, temp: 26 }}
          rearLeft={{ psi: 28, temp: 30 }}
          rearRight={{ psi: 29, temp: 28 }}
          onTirePress={handleTireDetails}
        />
      </View>

      {/* Example 3: Status checking */}
      <View style={styles.example}>
        <Text style={styles.exampleTitle}>3. Status Check</Text>
        <TruckTopDownView 
          frontLeft={{ psi: 32, temp: 25 }}
          frontRight={{ psi: 31, temp: 26 }}
          rearLeft={{ psi: 28, temp: 30 }}
          rearRight={{ psi: 29, temp: 28 }}
          onTirePress={handleTireStatus}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  example: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});

export default TireInteractionExample;
