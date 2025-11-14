import { SchoolValidationService } from '@/services/schoolValidationService';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DebugSchoolValidation() {
  const [serialNumber, setSerialNumber] = useState('04038');
  const [result, setResult] = useState<string>('');

  const testValidation = async () => {
    try {
      console.log('Testing serial number:', serialNumber);
      
      // Test 1: Get all valid schools
      const validSchools = await SchoolValidationService.getValidSchools();
      console.log('Total valid schools:', validSchools.length);
      console.log('First few schools:', validSchools.slice(0, 5));
      
      // Test 2: Find school with serial number 04038
      const targetSchool = validSchools.find(s => s.serialNumber === serialNumber);
      console.log('Target school found:', targetSchool);
      
      // Test 3: Use the service method
      const schoolName = await SchoolValidationService.getSchoolNameForSerial(serialNumber);
      console.log('School name from service:', schoolName);
      
      // Test 4: Check exact matching
      const exactMatch = validSchools.find(s => s.serialNumber.toLowerCase().trim() === serialNumber.toLowerCase().trim());
      console.log('Exact match:', exactMatch);
      
      setResult(`School: ${schoolName || 'NOT FOUND'}\nTotal schools: ${validSchools.length}\nTarget found: ${targetSchool ? 'YES' : 'NO'}\nExact match: ${exactMatch ? 'YES' : 'NO'}`);
      
    } catch (error) {
      console.error('Test error:', error);
      setResult(`Error: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Validation Debug</Text>
      
      <TextInput
        style={styles.input}
        value={serialNumber}
        onChangeText={setSerialNumber}
        placeholder="Enter serial number"
      />
      
      <TouchableOpacity style={styles.button} onPress={testValidation}>
        <Text style={styles.buttonText}>Test Validation</Text>
      </TouchableOpacity>
      
      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  result: {
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
});