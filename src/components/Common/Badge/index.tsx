import React from 'react';
import { View, Text } from 'react-native';
import { BadgeProps } from '../../types';
import styles from './styles';

const Badge: React.FC<BadgeProps> = ({ text, isConnected, style }) => {
    return (
        <View style={[styles.badge, {
            backgroundColor: isConnected ? '#4CAF50' : '#f44336',
        }, style]}>
            <Text style={styles.badgeText}>{text}</Text>
        </View>
    );
};

export default Badge;