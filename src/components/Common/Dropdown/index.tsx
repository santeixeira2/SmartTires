import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DropdownProps,DropdownOption} from './types';
import styles from './styles';


const Dropdown: React.FC<DropdownProps> = ({
    options,
    selectedValue,
    onSelect,
    placeholder = "Select an option",
    disabled = false,
    icon = "chevron-down",
    style,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const selectedOption = options.find(
      (option: DropdownOption) => option.value === selectedValue
    );
  
    const handleSelect = (value: string) => {
      onSelect(value);
      setIsOpen(false);
    };
  
    return (
      <>
        <TouchableOpacity
          style={[styles.dropdown, disabled && styles.dropdownDisabled, style]}
          onPress={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color="#6c757d"
              style={styles.inputIcon}
            />
          )}
          <View style={styles.dropdownContent}>
            <Text
              style={[
                styles.dropdownText,
                !selectedValue && styles.placeholderText,
              ]}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
            {selectedOption?.subtitle && (
              <Text style={styles.subtitleText}>{selectedOption.subtitle}</Text>
            )}
          </View>
  
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6c757d"
          />
        </TouchableOpacity>
  
        <Modal
          visible={isOpen}
          transparent={true}
  
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Option</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsOpen(false)}
                >
                  <Ionicons name="close" size={24} color="#6c757d" />
                </TouchableOpacity>
              </View>
  
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      selectedValue === item.value && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionText,
                          selectedValue === item.value &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.subtitle && (
                        <Text
                          style={[
                            styles.optionSubtitle,
                            selectedValue === item.value &&
                              styles.selectedOptionSubtitle,
                          ]}
                        >
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                    {selectedValue === item.value && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  };

export default Dropdown;