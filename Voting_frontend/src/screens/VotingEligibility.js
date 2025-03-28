import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const VotingEligibility = () => {
  const [voterId, setVoterId] = useState('');
  const [eventData, setEventData] = useState(null);
  const [isEligible, setIsEligible] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const fetchVotingDetails = async () => {
    try {
        setErrorMessage('');
        setEventData(null);
        setIsEligible(null);

        const response = await axios.get(`http://192.168.0.103:5000/api/voting-events/voting-id/${voterId}`);

        if (!response.data || Object.keys(response.data).length === 0) {
            setErrorMessage('No voting event found for your city.');
            return;
        }

        console.log(response.data)

        setEventData(response.data);
    } catch (error) {
        console.error("Error fetching voting details:", error.response?.data || error.message);
        setErrorMessage('Invalid voter ID or no event available.');
    }
  };

  const convertTo24HourFormat = (timeStr) => {
    if (!timeStr) return null;

    const [time, modifier] = timeStr.split(/\s+/); // Handle extra spaces
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier?.toUpperCase().includes("PM") && hours < 12) {
        hours += 12; // Convert PM to 24-hour format
    }
    if (modifier?.toUpperCase().includes("AM") && hours === 12) {
        hours = 0; // Convert 12 AM to 00
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};



  
const checkVotingEligibility = () => {
  if (!eventData) return;

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // Ensure format is YYYY-MM-DD
  const eventDate = new Date(eventData.date).toLocaleDateString('en-CA'); // Convert event date properly

  const eventStartTime = convertTo24HourFormat(eventData.startTime);
  const eventEndTime = convertTo24HourFormat(eventData.endTime);

  const currentFormattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // Debugging logs
  console.log("Raw Event Date from DB:", eventData.date);
  console.log("Parsed Event Date:", eventDate);
  console.log(`Current Date: ${currentDate}`);
  console.log(`Event Date: ${eventDate}`);
  console.log(`Current Time: ${currentFormattedTime}`);
  console.log(`Event Start Time: ${eventStartTime}`);
  console.log(`Event End Time: ${eventEndTime}`);

  // Check eligibility
  if (currentDate === eventDate && currentFormattedTime >= eventStartTime && currentFormattedTime <= eventEndTime) {
      console.log("✅ You are eligible to vote!");
      setIsEligible(true);
      navigation.navigate('Voting');
  } else {
      console.log("❌ You are NOT eligible to vote.");
      setIsEligible(false);
  }
};






  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voting Eligibility Check</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter Voter ID"
        value={voterId}
        onChangeText={setVoterId}
      />
      
      <TouchableOpacity style={styles.button} onPress={fetchVotingDetails}>
        <Text style={styles.buttonText}>Fetch Voting Details</Text>
      </TouchableOpacity>
      
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {eventData && (
        <View style={styles.eventDetails}>
          <Text>City: {eventData.city}</Text>
          <Text>Date: {new Date(eventData.date).toDateString()}</Text>
          <Text>Time: {eventData.startTime} - {eventData.endTime}</Text>
          <TouchableOpacity style={styles.button} onPress={checkVotingEligibility}>
            <Text style={styles.buttonText}>Check Eligibility</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEligible === false && <Text style={styles.notEligibleText}>You cannot vote at this time.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  eventDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  notEligibleText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default VotingEligibility;
