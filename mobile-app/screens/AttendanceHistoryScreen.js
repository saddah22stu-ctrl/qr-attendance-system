import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceHistoryScreen = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

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
      setRecords(response.data.records || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderRecord = ({ item }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.lectureName}>{item.lecture?.title}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status?.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.courseInfo}>{item.lecture?.course}</Text>
      <Text style={styles.dateInfo}>
        {new Date(item.checkedInAt).toLocaleDateString()} at {new Date(item.checkedInAt).toLocaleTimeString()}
      </Text>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#34C759';
      case 'late':
        return '#FF9500';
      case 'absent':
        return '#FF3B30';
      default:
        return '#666';
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
    <View style={styles.container}>
      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No attendance records yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  listContent: {
    padding: 10
  },
  recordCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  lectureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0'
  },
  courseInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5
  },
  dateInfo: {
    fontSize: 12,
    color: '#999'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400
  },
  emptyText: {
    fontSize: 16,
    color: '#999'
  }
});

export default AttendanceHistoryScreen;