import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import textBoxStyles from './textBoxStyles';
import Icon from 'react-native-vector-icons/Ionicons';

interface TextBoxProps extends Omit<TextInputProps, "value" | "onChangeText" | "placeholder"> {
    label?: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: string;
    secure?: boolean;
    editable?: boolean;
}

const TextBox = ({ 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    icon, 
    editable = true,
    secure = false,
    ...rest 
}: TextBoxProps ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Remove conflicting props from rest to avoid warnings/errors
    // These props are explicitly set above, so we don't want them overridden
    const safeRest = Object.fromEntries(
        Object.entries(rest).filter(([key]) => 
            !['secureTextEntry', 'autoCapitalize', 'autoCorrect', 'editable', 'returnKeyType', 'blurOnSubmit'].includes(key)
        )
    );

    // Calculate secureTextEntry value - only true when secure is true AND password is hidden
    const isSecureTextEntry = secure && !showPassword;

    return ( 
        <View style={textBoxStyles.container}>
      {label && <Text style={textBoxStyles.label}>{label}</Text>}
      <View style={textBoxStyles.inputContainer}>
        {icon && <Icon name={icon} size={20} color="#6c757d" style={textBoxStyles.inputIcon} />}

        <TextInput
          style={textBoxStyles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable !== false}
          returnKeyType="next"
          blurOnSubmit={false}
          {...safeRest}
        />

        {secure && (
          <TouchableOpacity
            style={textBoxStyles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            disabled={!editable}
          >
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6c757d"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
    )
}

export default TextBox;