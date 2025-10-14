import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

interface BadgeProps {
    text: string;
    isConnected: boolean;
    style?: any;
}

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