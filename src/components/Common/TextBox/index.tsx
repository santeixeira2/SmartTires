import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import textBoxStyles from './textBoxStyles';

interface TextBoxProps extends Omit<TextInputProps, "value" | "onChangeText" | "placeholder"> {
    label?: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: keyof typeof Ionicons.glyphMap;
    secure?: boolean;
    editable?: boolean;
}

const TextBox = ({ 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    icon, 
    editable,
    secure,
    ...rest 
}: TextBoxProps ) => {
    const [showPassword, setShowPassword] = useState(false);

    return ( 
        <View style={textBoxStyles.container}>
      {label && <Text style={textBoxStyles.label}>{label}</Text>}
      <View style={textBoxStyles.inputContainer}>
        {icon && <Ionicons name={icon} size={20} color="#6c757d" style={textBoxStyles.inputIcon} />}

        <TextInput
          style={textBoxStyles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure === true ? !showPassword : false}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable}
          {...rest}
        />

        {secure && (
          <TouchableOpacity
            style={textBoxStyles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            disabled={!editable}
          >
            <Ionicons
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