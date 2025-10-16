// import React, { useState, useEffect } from 'react';
// import { View, Text, PermissionsAndroid, StyleSheet, Platform, TouchableOpacity, Alert, Dimensions, ActivityIndicator } from 'react-native';
// import { Camera, useCodeScanner, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
// import Animated,
//   { useSharedValue,
//     useAnimatedStyle,
//     withRepeat,
//     withTiming,
//     interpolate,
//     useDerivedValue,
//   runOnJS,
//   } from 'react-native-reanimated';
// import styles from './styles';
// import CodeScannerFrame from 'vision-camera-code-scanner';

// const { width, height } = Dimensions.get('window');

// interface QrCodeScannerProps {
//   onCodeScanned: (code: string) => void;
//   onClose: () => void;
//   visible: boolean;
// }

// const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ 
//   onCodeScanned, 
//   onClose, 
//   visible 
// }) => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [isScanning, setIsScanning] = useState(true);
//   const device = useCameraDevice('back');
//   const { hasPermission: cameraPermission, requestPermission } = useCameraPermission();

//   const scanLineY = useSharedValue(0);
//   const cornerOpacity = useSharedValue(1);
//   const pulseScale = useSharedValue(1);

//   useEffect(() => {
//     const requestCameraPermission = async () => {
//       if (Platform.OS === 'android') {
//         const status = await PermissionsAndroid
//           .request(PermissionsAndroid.PERMISSIONS.CAMERA, 
//             {
//               title: 'Camera Permission',
//               message: 'We need access to your camera to scan QR codes',
//               buttonNeutral: 'Ask Me Later', 
//               buttonNegative: 'Cancel', 
//               buttonPositive: 'Grant'
//             }
//           );
//           setHasPermission(status == 'granted');
//         } else { 
//           if (hasPermission) {
//             requestCameraPermission();
//           } else { 
//             setHasPermission(true); 
//           }
//         }
//       };

//       if (visible) requestCameraPermission();

//     }, [visible, hasPermission, cameraPermission, requestPermission]);

//   useEffect(() => {
//     if (visible && hasPermission) { 
//       scanLineY.value = withRepeat(
//         withTiming(200, { duration: 2000 }),
//         -1,
//         true
//       ); 
//       cornerOpacity.value = withRepeat(
//         withTiming(0.3, { duration: 2000 }),
//         -1,
//         true
//       );
//       pulseScale.value = withRepeat(
//         withTiming(1.2, { duration: 2000 }),
//         -1,
//         true
//       );
//     }
//   }, [visible, hasPermission]);

//   const codeScanner = useCodeScanner (
//     {
//       codeTypes: ['qr', 'ean-13', 'code-128', 'code-39'],
//       onCodeScanned: (codes) => {
//         if (codes.length > 0 && isScanning ) {
//           if (codes[0].value) {
//             setIsScanning(false);
//             runOnJS(onCodeScanned)(codes[0].value);
//             runOnJS(onClose)();
//           }
//         }
//       }
//     }
//   )

//   const animatedScanLineStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateY: scanLineY.value }],
//       opacity: interpolate(scanLineY.value, [0, 200], [1, 0.3]),
//     }
//   }); 

//   const animatedCornerStyle = useAnimatedStyle(() => {
//     return {
//       opacity: cornerOpacity.value,
//     }
//   })

//   const animatedPulseStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ scale: pulseScale.value }]
//     }
//   })

//   const handleClose = () => {
//     setIsScanning(true);
//     onClose();
//   }

//   const handleFlashlight = () => {
//     Alert.alert("Flashlight", "Flashlight functionality is not available in this version");
//   }

//   if (!visible) return null;
  
//   if (!hasPermission) return (
//     <View style={styles.permissionContainer}>
//       <Text style={styles.permissionText}>We need access to your camera to scan QR codes</Text>
//       <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//         <Text style={styles.permissionButtonText}>Close</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (!device) return (
//     <View style={styles.loadingContainer}>
//       <Text style={styles.loadingText}>Loading Camera...</Text>
//       <ActivityIndicator size="large" color="#007bff" />
//     </View>
//   )

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={visible && hasPermission}
//         codeScanner={codeScanner}
//         torch="off"
//         enableZoomGesture={true}
//       />
//       <View style={styles.overlay}>
//         <View style={styles.topSection}>
//           <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
//             <Text style={styles.closeButtonText}>✕</Text>
//           </TouchableOpacity>
//             <Text style={styles.title}>Scan QR Code</Text>
//           <TouchableOpacity style={styles.flashlightButton} onPress={handleFlashlight}>
//             <Text style={styles.flashlightButtonText}>💡</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.scanningArea}>
//           <View style={styles.scanFrame}>
//             <Animated.View style={[styles.corner, styles.topLeft, animatedCornerStyle]} />
//             <Animated.View style={[styles.corner, styles.topRight, animatedCornerStyle]} />
//             <Animated.View style={[styles.corner, styles.bottomLeft, animatedCornerStyle]} />
//             <Animated.View style={[styles.corner, styles.bottomRight, animatedCornerStyle]} />
//             <Animated.View style={[styles.scanLine, animatedScanLineStyle]} />
//             <Animated.View style={[styles.pulseEffect, animatedPulseStyle]} />
//           </View>
//         </View>
//         <View style={styles.bottomSection}>
//           <Text style={styles.instructionText}>
//             Position the QR code within the frame
//             </Text>
//             <Text style={styles.subInstructionText}>
//               Make sure the code is well-lit and clearly visible
//             </Text>
//           </View>
//         </View>
//       </View>
//   )
// } 

// export default QrCodeScanner;