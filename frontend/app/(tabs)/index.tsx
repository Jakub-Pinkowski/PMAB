import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the App</Text>
      <Text style={styles.subheader}>Choose a section to explore:</Text>

      <View style={styles.buttonContainer}>
        {/* Buttons for navigation */}
        {/* TODO: Add just main tables and business views */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    color: '#777',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
