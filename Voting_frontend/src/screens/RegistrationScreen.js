import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TextInput, Button, Snackbar, Card, Divider, Dialog, Portal } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Crypto from 'expo-crypto';
import RNPickerSelect from 'react-native-picker-select';
import * as Clipboard from 'expo-clipboard';

const statesWithDistricts = { /* same as before */ };
const cityList = { /* same as before */ };

const RegistrationScreen = ({ navigation }) => {

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [aadhaar, setAadhaar] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [voterId, setVoterId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  const statesWithDistricts = {
    Maharashtra: ['Pune', 'Mumbai', 'Nagpur'],
    Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
    TamilNadu: ['Chennai', 'Coimbatore', 'Madurai'],
  };

  const cityList = {
    Pune: ['Hinjewadi', 'Shivaji Nagar', 'Kothrud'],
    Mumbai: ['Andheri', 'Dadar', 'Borivali'],
    Nagpur: ['Dharampeth', 'Sitabuldi', 'Manewada'],
    Bangalore: ['Electronic City', 'Whitefield', 'Malleshwaram'],
    Mysore: ['Hebbal', 'Vijayanagar', 'Kuvempunagar'],
    Hubli: ['Gokul Road', 'Vidyanagar', 'Old Hubli'],
    Ahmedabad: ['Navrangpura', 'Maninagar', 'Bopal'],
    Surat: ['Adajan', 'Vesu', 'Varachha'],
    Vadodara: ['Alkapuri', 'Gotri', 'Manjalpur'],
    Chennai: ['Adyar', 'T. Nagar', 'Velachery'],
    Coimbatore: ['RS Puram', 'Gandhipuram', 'Peelamedu'],
    Madurai: ['Anna Nagar', 'KK Nagar', 'Alagappan Nagar'],
  };


  // const generateVoterID = async () => {
  //   const uniqueString = `${fullName}${dob}${aadhaar}${phone}${state}${district}${city}`;
  //   return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, uniqueString);
  // };

  const resetForm = () => {
    setFullName('');
    setDob(new Date());
    setAadhaar('');
    setPhone('');
    setState('');
    setDistrict('');
    setCity('');
    setVoterId(null);
  };

  // const handleRegistration = async () => {
  //   const today = new Date();
  //   const age = today.getFullYear() - dob.getFullYear();
  //   if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
  //     age--;
  //   }
  //   if (age < 18) {
  //     setSnackbarMessage('You must be at least 18 years old to register.');
  //     setSnackbarVisible(true);
  //     return;
  //   }
  //   if (!/\d{12}/.test(aadhaar)) {
  //     setSnackbarMessage('Aadhaar number must be 12 digits.');
  //     setSnackbarVisible(true);
  //     return;
  //   }
  //   if (!/\d{10}/.test(phone)) {
  //     setSnackbarMessage('Phone number must be 10 digits.');
  //     setSnackbarVisible(true);
  //     return;
  //   }
  //   if (!state || !district || !city) {
  //     setSnackbarMessage('Please select your State, District, and City.');
  //     setSnackbarVisible(true);
  //     return;
  //   }

  //   const voterHash = await generateVoterID();
  //   setVoterId(voterHash.substring(0, 10));
  //   setDialogVisible(true);
  // };

  const copyToClipboard = () => {
    Clipboard.setStringAsync(voterId);
    setSnackbarMessage('Voter ID copied to clipboard!');
    setSnackbarVisible(true);
  };

  const handleRegistration = async () => {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
      age--;
    }
  
    if (age < 18) {
      setSnackbarMessage("You must be at least 18 years old to register.");
      setSnackbarVisible(true);
      return;
    }
  
    if (!/\d{12}/.test(aadhaar)) {
      setSnackbarMessage("Aadhaar number must be 12 digits.");
      setSnackbarVisible(true);
      return;
    }
  
    if (!/\d{10}/.test(phone)) {
      setSnackbarMessage("Phone number must be 10 digits.");
      setSnackbarVisible(true);
      return;
    }
  
    if (!state || !district || !city) {
      setSnackbarMessage("Please select your State, District, and City.");
      setSnackbarVisible(true);
      return;
    }
  
    try {
      const response = await fetch("http://192.168.0.104:5000/api/voters/register", {       
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          age,
          state,
          district,
          city,
          phone,
        }),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Debugging log
  
      if (response.ok && data.voter_id) {
        setVoterId(data.voter_id);
        setDialogVisible(true);
      } else {
        setSnackbarMessage(data.message || "Registration failed.");
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setSnackbarMessage("Server error. Please try again.");
      setSnackbarVisible(true);
    }
  };
  
  

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20 }}>
        <Card style={{ padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Voter Registration</Text>
          <TextInput label="Full Name" value={fullName} onChangeText={setFullName} mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Date of Birth" value={dob.toDateString()} onFocus={() => setShowDatePicker(true)} mode="outlined" style={{ marginBottom: 10 }} />
          {showDatePicker && (
            <DateTimePicker value={dob} mode="date" display="default" onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDob(selectedDate);
            }} />
          )}
          <TextInput label="Aadhaar Number" value={aadhaar} onChangeText={setAadhaar} keyboardType="numeric" maxLength={12} mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="numeric" maxLength={10} mode="outlined" style={{ marginBottom: 10 }} />
          
          <Text>State</Text>
          <RNPickerSelect onValueChange={(value) => {
            setState(value);
            setDistrict('');
            setCity('');
          }} items={Object.keys(statesWithDistricts).map((state) => ({ label: state, value: state }))} />

          {state !== '' && (
            <>
              <Text>District</Text>
              <RNPickerSelect onValueChange={(value) => {
                setDistrict(value);
                setCity('');
              }} items={statesWithDistricts[state].map((district) => ({ label: district, value: district }))} />
            </>
          )}

          {district !== '' && (
            <>
              <Text>City</Text>
              <RNPickerSelect onValueChange={setCity} items={cityList[district].map((city) => ({ label: city, value: city }))} />
            </>
          )}

          <Divider style={{ marginVertical: 20 }} />
          <Button mode="contained" onPress={handleRegistration} buttonColor="rgb(0, 86, 179)">Register</Button>
        </Card>
      </View>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => { setDialogVisible(false); resetForm(); }}>
          <Dialog.Title>Registration Complete</Dialog.Title>
          <Dialog.Content>
            <Text>Your Voter ID: {voterId || "Not available"}</Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={copyToClipboard}>Copy Voter ID</Button>
            <Button onPress={() => { setDialogVisible(false); resetForm(); }}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>{snackbarMessage}</Snackbar>
    </ScrollView>
  );
};

export default RegistrationScreen;
