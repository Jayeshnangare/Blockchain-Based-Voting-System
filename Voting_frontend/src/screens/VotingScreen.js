import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const VotingScreen = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voterID, setVoterID] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [thankYouScreen, setThankYouScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [candidate_adhar, setCandidate_adhar] = useState(null);

  // 📌 Function: Send OTP
  const handleSendOtp = async () => {
    if (!voterID.trim()) return Alert.alert('Error', 'Please enter a valid Voter ID');

    setLoading(true);
    
    try {
      const response = await fetch('http://192.168.0.104:5000/api/voters/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterID }),
      });

      console.log("Voter ID Sent to Backend:", voterID)
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setOtpSent(true);
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to send OTP. Try again later.');
    }
  };

  // 📌 Function: Verify OTP
  const handleLogin = async () => {
    if (!otp.trim()) return Alert.alert('Error', 'Please enter the OTP');
    if (!voterID) return Alert.alert('Error', 'Voter ID is missing');
  
    setLoading(true);
    try {
      console.log("Sending Voter ID:", voterID);
  
      const response = await fetch('http://192.168.0.104:5000/api/voters/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterID, otp }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      console.log("OTP Verification Response:", data);
  
      if (response.ok) {
        setIsLoggedIn(true);
        setState(data.voter.state);
        setCity(data.voter.city);
        fetchCandidates(data.voter.city);
  
        Alert.alert('Success', `Welcome, ${data.voter.name}`);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'OTP verification failed. Try again.');
    }
  };
  


  // // 📌 Function: Fetch Candidates for Voter's City
  // const fetchCandidates = async (city) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`http://192.168.0.103:5000/api/candidates/filter?state=Maharashtra&city=Shivaji Nagar`);
  //     const data = await response.json();
  //     console.log(data);
  //     setLoading(false);

  //     if (response.ok) {
  //       setCandidates(data.candidates);
  //     } else {
  //       Alert.alert('Error', 'No candidates found for your city.');
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     Alert.alert('Error', 'Failed to load candidates.');
  //   }
  // };
  const fetchCandidates = async (city) => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.0.104:5000/api/candidates/filter?state=Maharashtra&city=${city}`);
      const data = await response.json();
  
      console.log("API Response:", data);
  
      if (Array.isArray(data) && data.length > 0) {
        setCandidates(data);
      } else {
        setCandidates([]); // Empty array prevents errors
        Alert.alert('Error', 'No candidates found for your city.');
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      Alert.alert('Error', 'Failed to load candidates.');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  // 📌 Function: Submit Vote
  const handleVote = async () => {
    if (!selectedCandidate) {
        Alert.alert('Error', 'Please select a candidate to vote.');
        return;
    }

    console.log("Selected candidate:", selectedCandidate.aadhar);
    console.log("Voter ID:", voterID);

    setLoading(true);
    try {
        const response = await fetch("http://192.168.0.104:5000/api/voters/vote", {  // FIXED URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voterAddress: voterID, candidateId: parseInt(selectedCandidate.aadhar) })  // FIXED FIELD NAME
        });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            setThankYouScreen(true);
        } else {
            Alert.alert('Error', data.message);
        }
    } catch (error) {
        setLoading(false);
        console.error("Vote submission error:", error);
        Alert.alert('Error', 'Failed to submit vote.');
    }
};

  return (
    <View style={styles.container}>
      {thankYouScreen ? (
        <View style={styles.thankYouContainer}>
          <Text style={styles.thankYouText}>Thank you for voting!</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>Voting Portal</Text>

          {loading && <ActivityIndicator size="large" color="#0056B3" />}

          {!isLoggedIn ? (
            <View style={styles.authContainer}>
              <TextInput style={styles.input} placeholder="Enter Voter ID" value={voterID} onChangeText={setVoterID} />
              <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>

              {otpSent && (
                <>
                  <TextInput style={styles.input} placeholder="Enter OTP" value={otp} onChangeText={setOtp} />
                  <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <>
              {candidates.length > 0 ? (
                <View style={styles.candidateList}>
                  {candidates.map((c, i) => (
                    <TouchableOpacity key={i} style={styles.candidate} onPress={() => setSelectedCandidate(c)}>
                      <Text style={[styles.candidateText, selectedCandidate?.name === c.name && styles.selectedCandidate]}>
                        {selectedCandidate?.name === c.name ? '✅' : '⬜'} {c.name} ({c.party})
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.button} onPress={handleVote}>
                    <Text style={styles.buttonText}>Vote</Text>
                  </TouchableOpacity>
                </View>
              ) : <Text style={styles.noCandidates}>No candidates available.</Text>}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', alignItems: 'center' },
  scrollContainer: { padding: 20, alignItems: 'center', width: '100%' },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#0056B3', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#0056B3', borderRadius: 8, padding: 12, marginVertical: 10, width: '95%', fontSize: 18, backgroundColor: '#FFF' },
  button: { backgroundColor: '#0056B3', padding: 15, borderRadius: 8, marginVertical: 10, width: '95%', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  candidateList: { width: '95%', marginTop: 20 },
  candidate: { padding: 20, backgroundColor: '#EAECEE', marginVertical: 8, borderRadius: 8 },
  candidateText: { fontSize: 18 },
  selectedCandidate: { fontWeight: 'bold', color: '#0056B3' },
  thankYouContainer: { justifyContent: 'center', alignItems: 'center', height: '100%' },
  thankYouText: { fontSize: 24, fontWeight: 'bold', color: '#28A745' },
});

export default VotingScreen;
