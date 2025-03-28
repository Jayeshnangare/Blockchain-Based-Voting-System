import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const MainScreen = ({ navigation }) => {  // Destructuring navigation prop
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Icon name="check-circle" size={28} color="#F8F9FA" style={styles.headerIcon} />
        <Text style={styles.headerText}>Secure Voting System</Text>
      </View>

      {/* Main Button Section */}
      <View style={styles.gridContainer}>
        {[
          { name: 'Voter Registration', icon: 'user-edit', page: 'Registration' },
          { name: 'Cast Your Vote', icon: 'vote-yea', page: 'VotingEligibility' },
          { name: 'View Results', icon: 'chart-line', page: 'Results' },
          { name: 'Admin Panel', icon: 'lock', page: 'AdminLogin' },
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.gridItem} 
            onPress={() => navigation.navigate(item.page)} // Corrected navigation
          >
            <Icon name={item.icon} size={38} color="#0056B3" />
            <Text style={styles.gridText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0056B3',
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  headerIcon: {
    marginRight: 12,
    marginTop: 12,
  },
  headerText: {
    color: '#F8F9FA',
    fontWeight: 'bold',
    fontSize: 24,
    fontFamily: 'Open Sans',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 12,
  },
  gridContainer: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  gridItem: {
    backgroundColor: '#EAECEE',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#0056B3',
  },
  gridText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#2D2D44',
    fontSize: 20,
    fontFamily: 'Open Sans',
    fontWeight: '700',
  },
});

export default MainScreen;
