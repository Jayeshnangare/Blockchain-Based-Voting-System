import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.avatar} />
        <View>
          <Text style={styles.headerText}>VALENTINO C I Std - A</Text>
          <Text style={styles.subHeaderText}>Welcome Back!</Text>
        </View>
      </View>

      {/* Grid Section */}
      <View style={styles.grid}>
        {[
          { name: 'Attendance', icon: 'check-circle' },
          { name: 'Messages', icon: 'envelope' },
          { name: 'Profile', icon: 'user' },
          { name: 'Marks', icon: 'graduation-cap' },
          { name: 'Track Location', icon: 'map-marker' },
          { name: 'Fees', icon: 'money' }
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.gridItem}>
            <Icon name={item.icon} size={30} color="#1e3a8a" />
            <Text style={styles.gridText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activities Section */}
      <View style={styles.activitiesHeader}>
        <Text style={styles.activitiesText}>ACTIVITIES</Text>
        <Text style={styles.seeAllText}>SEE ALL</Text>
      </View>

      <View style={styles.grid}>
        {['Karate', 'Yoga', 'Bharathanatyam'].map((activity, index) => (
          <TouchableOpacity key={index} style={styles.gridItem}>
            <Text style={styles.gridText}>{activity}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  headerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  subHeaderText: {
    color: '#fbbf24',
    fontSize: 14,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#ffffff',
    width: '30%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  gridText: {
    textAlign: 'center',
    marginTop: 8,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  activitiesText: {
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#6b7280',
  },
});

export default App;
