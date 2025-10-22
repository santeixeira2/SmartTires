import { Dimensions, Linking, Platform } from 'react-native';

export const openSettings = () => {
    if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:');
    } else {
        Linking.openURL('package:com.android.settings');
  }
};