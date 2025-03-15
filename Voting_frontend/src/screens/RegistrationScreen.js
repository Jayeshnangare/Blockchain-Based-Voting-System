import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Crypto from 'expo-crypto';
import RNPickerSelect from 'react-native-picker-select';

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

  // Generate unique voter ID using hashing
  const generateVoterID = async () => {
    const uniqueString = `${fullName}${dob}${aadhaar}${phone}${state}${district}${city}`;
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, uniqueString);
  };

  // Handle Registration Logic
  const handleRegistration = async () => {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) {
      Alert.alert('Error', 'You must be at least 18 years old to register.');
      return;
    }

    if (!/^\d{12}$/.test(aadhaar)) {
      Alert.alert('Error', 'Aadhaar number must be 12 digits.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Error', 'Phone number must be 10 digits.');
      return;
    }

    if (!state || !district || !city) {
      Alert.alert('Error', 'Please select your State, District, and City.');
      return;
    }

    const voterHash = await generateVoterID();
    setVoterId(voterHash);

    const voterBlock = {
      fullName,
      dob: dob.toISOString().split('T')[0],
      aadhaar,
      phone,
      state,
      district,
      city,
      voterId: voterHash,
      timestamp: new Date().toISOString(),
    };

    console.log('Blockchain Block:', JSON.stringify(voterBlock, null, 2));
    Alert.alert('Success', `Registration Complete! Your Voter ID: ${voterHash.substring(0, 10)}`);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
  <Text>Full Name:</Text>
  <TextInput
    value={fullName}
    onChangeText={setFullName}
    placeholder="Enter your full name"
    style={{ borderBottomWidth: 1, marginBottom: 16 }}
  />

  <Text>Date of Birth:</Text>
  <TextInput
    value={dob.toDateString()}
    onFocus={() => setShowDatePicker(true)}
    style={{ borderBottomWidth: 1, marginBottom: 16 }}
  />
  {showDatePicker && (
    <DateTimePicker
      value={dob}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDob(selectedDate);
      }}
    />
  )}

  <Text>Aadhaar Number:</Text>
  <TextInput
    value={aadhaar}
    onChangeText={setAadhaar}
    placeholder="Enter 12-digit Aadhaar"
    keyboardType="numeric"
    maxLength={12}
    style={{ borderBottomWidth: 1, marginBottom: 16 }}
  />

  <Text>Phone Number:</Text>
  <TextInput
    value={phone}
    onChangeText={setPhone}
    placeholder="Enter 10-digit Phone Number"
    keyboardType="numeric"
    maxLength={10}
    style={{ borderBottomWidth: 1, marginBottom: 16 }}
  />

  <Text>State:</Text>
  <RNPickerSelect
  
    onValueChange={(value) => {
      setState(value);
      setDistrict('');
      setCity('');
    }}
    items={Object.keys(statesWithDistricts).map((state) => ({ label: state, value: state }))}
    style={{ inputAndroid: { borderBottomWidth: 1, marginBottom: 16 } }}
  />

  {state !== '' && (
    <>
      <Text>District:</Text>
      <RNPickerSelect
      
        onValueChange={(value) => {
          setDistrict(value);
          setCity('');
        }}
        items={statesWithDistricts[state].map((district) => ({ label: district, value: district }))}
        style={{ inputAndroid: { borderBottomWidth: 1, marginBottom: 16 } }}
      />
    </>
  )}

  {district !== '' && (
    <>
      <Text>City:</Text>
      <RNPickerSelect
        onValueChange={setCity}
        items={cityList[district].map((city) => ({ label: city, value: city }))}
        style={{ inputAndroid: { borderBottomWidth: 1, marginBottom: 16 } }}
      />
    </>
  )}

  <Button title="Register" onPress={handleRegistration} />

  {voterId && (
    <Text style={{ marginTop: 16, fontWeight: 'bold' }}>
      Your Voter ID: {voterId.substring(0, 10)}
    </Text>
  )}

  <Button title="Go to Admin" onPress={() => navigation.navigate("Admin")} />
  <Button title="Go to voting" onPress={() => navigation.navigate("Voting")} />
</View>

  );
};

export default RegistrationScreen;
