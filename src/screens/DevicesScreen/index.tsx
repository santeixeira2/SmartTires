import React from 'react';
import { View, Text } from 'react-native';
import Header from '../../components/Common/Header';
import styles from './styles';

const DevicesScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Devices" />
      <View style={styles.content}>
      <Text style={styles.placeholderEmoji}>🔧</Text>
          <Text style={styles.placeholderTitle}>Working on it</Text>
          <Text style={styles.placeholderSubtitle}>Device connection features coming soon</Text>
          <Text style={styles.todoText}>TODO: Implement device management</Text>
      </View>
    </View>
  )
}

export default DevicesScreen;