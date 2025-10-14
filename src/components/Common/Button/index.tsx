import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ButtonProps {
    label: string;
    onPress: () => void;
    icon?: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>; 
}

const Button = ({ label, onPress, icon, disabled, style }: ButtonProps) => {
    return (
        <TouchableOpacity 
            style={[styles.button, style]} 
            onPress={onPress} 
            disabled={disabled}>
            {icon && <Ionicons name={icon} size={20} color="#fff" />}
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

export default Button;