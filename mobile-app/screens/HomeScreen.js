import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');
      setUserData(JSON.parse(data));

      const response = await axios.get(
        `${API_URL}/reports/student/${JSON.parse(data)._id}/stats`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {userData?.name}!</Text>
        <Text style={styles.role}>{userData?.role?.toUpperCase()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Classes</Text>
          <Text style={styles.statValue}>{stats?.totalClasses || 0}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Present</Text>
          <Text style={[styles.statValue, { color: '#34C759' }]}>{stats?.present || 0}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Late</Text>
          <Text style={[styles.statValue, { color: '#FF9500' }]}>{stats?.late || 0}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Absent</Text>
          <Text style={[styles.statValue, { color: '#FF3B30' }]}>{stats?.absent || 0}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How to use:</Text>
        <Text style={styles.infoText}>1. Go to Scanner tab</Text>
        <Text style={styles.infoText}>2. Point camera at QR code</Text>
        <Text style={styles.infoText}>3. Attendance will be marked automatically</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  role: {
    fontSize: 14,
    color: '#E8E8E8',
    marginTop: 5
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between'
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    elevation: 2
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  infoCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  }
});

export default HomeScreen;