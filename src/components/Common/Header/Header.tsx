import React from 'react';
import { View, Text } from 'react-native';
import styles from './Header.style';

type Props = {
    title: string;
    subtitle?: string;
}

const Header = ({ title, subtitle }: Props) => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

export default Header;