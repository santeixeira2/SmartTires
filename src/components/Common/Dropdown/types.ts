import { StyleProp, ViewStyle } from "react-native";


export interface DropdownOption {
    label: string;
    value: string;
    subtitle?: string;
  }
  
export interface DropdownProps {
    options: DropdownOption[];
    selectedValue?: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    icon?: string;
    style?: StyleProp<ViewStyle>;
}