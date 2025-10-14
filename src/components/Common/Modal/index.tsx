import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal, ScrollView, Dimensions} from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import styles from './styles';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    maxHeight?: number;
}

const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    children,
    footer,
    maxHeight,
}) => {
    return (
        <RNModal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { maxHeight: maxHeight || Dimensions.get('window').height - 100 }]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6c757d" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                    {footer && <View style={styles.footer}>{footer}</View>}
                </View>
            </View>
        </RNModal>
    )
}

export default Modal;