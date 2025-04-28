import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
const ChainCreationScreen = ({ user, navigation }) => {
  const [name, setName] = useState('');
  const [mainOffer, setMainOffer] = useState('');
  const [mainRequest, setMainRequest] = useState('');

  const handleCreate = async () => {
    if (!name || !mainOffer || !mainRequest) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      await firestore().collection('Chains').add({
        name: name,
        main_offer: mainOffer,
        main_request: mainRequest,
        user_id: user.uid,
        listings: [],
        created_at: new Date()
      });
      navigation.goBack();
    } catch (error) {
        console.log(error)
      Alert.alert('Ошибка', 'Не удалось создать цепочку');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Название цепочки"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Основное предложение"
        placeholderTextColor="#999"
        value={mainOffer}
        onChangeText={setMainOffer}
        style={styles.input}
      />
      <TextInput
        placeholder="Основной запрос"
        placeholderTextColor="#999"
        value={mainRequest}
        onChangeText={setMainRequest}
        style={styles.input}
      />
      
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.buttonText}>Создать цепочку</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  createButton: {
    backgroundColor: '#D16002',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default ChainCreationScreen;
