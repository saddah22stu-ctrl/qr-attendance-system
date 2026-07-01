import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [userData, setUserData] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    requestCameraPermission();
    loadUserData();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      setUserData(JSON.parse(data));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setScanning(false);

    try {
      let location = null;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        location = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        };
      }

      const [lectureId, qrToken] = data.split(':');
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.post(
        `${API_URL}/attendance/mark`,
        {
          studentId: userData._id,
          lectureId,
          qrToken,
          location
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert('Success', `Attendance marked! Status: ${response.data.attendance.status}`, [
        { text: 'OK', onPress: () => {
          setScanned(false);
          setScanning(true);
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to mark attendance', [
        { text: 'OK', onPress: () => {
          setScanned(false);
          setScanning(true);
        }}
      ]);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scanning ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}

      <View style={styles.overlay}>
        <View style={styles.scanArea} />
      </View>

      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => {
            setScanned(false);
            setScanning(true);
          }}
        >
          <Text style={styles.rescanText}>Tap to Rescan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 10,
    backgroundColor: 'transparent'
  },
  rescanButton: {
    position: 'absolute',
    bottom: 50,
    left: '25%',
    right: '25%',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  rescanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center'
  }
});

export default ScannerScreen;