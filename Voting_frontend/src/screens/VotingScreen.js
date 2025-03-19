import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const VotingScreen = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [accountAddress, setAccountAddress] = useState('');
  const [votingDates, setVotingDates] = useState('');
  const [voteMessage, setVoteMessage] = useState('');
  const [voterID, setVoterID] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [thankYouScreen, setThankYouScreen] = useState(false);

  const navigation = useNavigation();

  const citiesByState = {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Delhi: ['New Delhi', 'North Delhi', 'South Delhi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
  };

  useEffect(() => {
    setCandidates([
      { name: 'Candidate 1', party: 'Party A', city: 'Mumbai', state: 'Maharashtra' },
      { name: 'Candidate 2', party: 'Party B', city: 'Delhi', state: 'Delhi' },
      { name: 'Candidate 3', party: 'Party C', city: 'Chennai', state: 'Tamil Nadu' },
      { name: 'Candidate 4', party: 'Party D', city: 'Mumbai', state: 'Maharashtra' },
      { name: 'Candidate 5', party: 'Party E', city: 'Delhi', state: 'Delhi' },
      { name: 'Candidate 6', party: 'Party F', city: 'Bangalore', state: 'Karnataka' },
    ]);
    setVotingDates('Jan 1, 2025 - Jan 7, 2025');
    setAccountAddress('0x1234567890abcdef');
  }, []);

  useEffect(() => {
    if (state && city) {
      setFilteredCandidates(
        candidates.filter((candidate) => candidate.city === city && candidate.state === state)
      );
    } else {
      setFilteredCandidates([]);
    }
  }, [state, city, candidates]);

  const handleSendOtp = () => {
    if (voterID.trim() !== '') {
      setOtpSent(true);
      setVoteMessage('OTP has been sent to your registered mobile number.');
    } else {
      setVoteMessage('Please enter a valid Voter ID.');
    }
  };

  const handleLogin = () => {
    if (otp.trim() !== '') {
      setIsLoggedIn(true);
      setVoteMessage('');
    } else {
      setVoteMessage('Please enter the OTP.');
    }
  };

  const handleVote = () => {
    if (selectedCandidate) {
      setVoteMessage(`You voted for ${selectedCandidate.name}`);
      setThankYouScreen(true);
    } else {
      setVoteMessage('Please select a candidate to vote.');
    }
  };

  return (
    <View style={styles.container}>
      {thankYouScreen ? (
        <View style={styles.thankYouContainer}>
          <Text style={styles.thankYouText}>Thank you for voting!</Text>
          <TouchableOpacity style={styles.voteButton} onPress={() => navigation.navigate('Main')}>
            <Text style={styles.voteButtonText}>Go to HOME PAGE</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>Welcome to Voting</Text>
            <Text style={styles.headerText}>Voting Dates: {votingDates}</Text>
          </View>

          {!isLoggedIn ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter Voter ID"
                value={voterID}
                onChangeText={setVoterID}
              />
              <TouchableOpacity onPress={handleSendOtp} style={styles.voteButton}>
                <Text style={styles.voteButtonText}>Send OTP</Text>
              </TouchableOpacity>
              {otpSent && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <TouchableOpacity onPress={handleLogin} style={styles.voteButton}>
                    <Text style={styles.voteButtonText}>Login</Text>
                  </TouchableOpacity>
                </>
              )}
              {voteMessage ? <Text style={styles.voteMessage}>{voteMessage}</Text> : null}
            </>
          ) : (
            <>
              <Picker selectedValue={state} style={styles.picker} onValueChange={setState}>
                <Picker.Item label="Please select a state" value="" />
                {Object.keys(citiesByState).map((stateName) => (
                  <Picker.Item key={stateName} label={stateName} value={stateName} />
                ))}
              </Picker>

              {state ? (
                <Picker selectedValue={city} style={styles.picker} onValueChange={setCity}>
                  <Picker.Item label="Please select a city" value="" />
                  {citiesByState[state]?.map((cityOption, index) => (
                    <Picker.Item key={index} label={cityOption} value={cityOption} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.errorText}>Please select a state first</Text>
              )}

              {filteredCandidates.length > 0 ? (
                <>
                  <View style={styles.candidateList}>
                    {filteredCandidates.map((candidate, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.candidateRow}
                        onPress={() => setSelectedCandidate(candidate)}
                      >
                        <Text
                          style={[
                            styles.candidateText,
                            selectedCandidate?.name === candidate.name && styles.boldCandidate,
                          ]}
                        >
                          {selectedCandidate?.name === candidate.name ? '🔘' : '⚪'} {candidate.name} ({candidate.party})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity onPress={handleVote} style={styles.voteButton}>
                    <Text style={styles.voteButtonText}>Vote</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.noCandidates}>No candidates available for your location.</Text>
              )}

              <Text style={styles.account}>Account Address: {accountAddress}</Text>
            </>
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    backgroundColor: '#0056B3',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  headerText: {
    color: '#F8F9FA',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Open Sans',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#0056B3',
    borderRadius: 12,
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  picker: {
    height: 50,
    width: '90%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#0056B3',
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  candidateList: {
    marginTop: 30,
    marginBottom: 20,
    width: '90%',
  },
  candidateRow: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    backgroundColor: '#EAECEE',
    marginVertical: 5,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  candidateText: {
    fontSize: 18,
  },
  boldCandidate: {
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 16,
    color: '#495057',
    marginVertical: 10,
    textAlign: 'center',
  },
  voteButton: {
    backgroundColor: '#0056B3',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 24,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  voteButtonText: {
    color: '#F8F9FA',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  thankYouContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  thankYouText: {
    fontSize: 22,
    color: '#28A745',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  voteMessage: {
    fontSize: 16,
    color: '#28A745',
    marginVertical: 10,
  },
  noCandidates: {
    fontSize: 16,
    color: '#FF6347',
    marginVertical: 20,
    textAlign: 'center',
  },
  account: {
    marginTop: 20,
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
  },
});

export default VotingScreen;
