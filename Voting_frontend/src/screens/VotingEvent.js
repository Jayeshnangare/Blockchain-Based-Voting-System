import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const VotingEvent = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const handleSubmit = () => {
    console.log({
      state,
      district,
      city,
      date: date.toDateString(),
      time: time.toLocaleTimeString(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Voting Event</Text>

      {/* State Picker */}
      <Text style={styles.label}>Select State:</Text>
      <Picker selectedValue={state} onValueChange={(value) => setState(value)} style={styles.picker}>
        <Picker.Item label="Select State" value="" />
        <Picker.Item label="Maharashtra" value="Maharashtra" />
        <Picker.Item label="Gujarat" value="Gujarat" />
      </Picker>

      {/* District Picker */}
      <Text style={styles.label}>Select District:</Text>
      <Picker selectedValue={district} onValueChange={(value) => setDistrict(value)} style={styles.picker}>
        <Picker.Item label="Select District" value="" />
        <Picker.Item label="Pune" value="Pune" />
        <Picker.Item label="Mumbai" value="Mumbai" />
      </Picker>

      {/* City Picker */}
      <Text style={styles.label}>Select City:</Text>
      <Picker selectedValue={city} onValueChange={(value) => setCity(value)} style={styles.picker}>
        <Picker.Item label="Select City" value="" />
        <Picker.Item label="Pune City" value="Pune City" />
        <Picker.Item label="Mumbai City" value="Mumbai City" />
      </Picker>

      {/* Date Picker */}
      <Text style={styles.label}>Select Date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}

      {/* Time Picker */}
      <Text style={styles.label}>Select Time:</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text>{time.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" display="default" onChange={onTimeChange} />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    maxWidth: 600,
    margin: "auto",
  },
  header: {
    color: "#0056B3",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#2D2D44",
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#EAECEE",
    color: "#2D2D44",
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#EAECEE",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0056B3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#F8F9FA",
    fontWeight: "bold",
  },
});

export default VotingEvent;
