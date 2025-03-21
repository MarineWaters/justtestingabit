/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import { FlatList } from "react-native";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  useColorScheme,
  View,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = ({user}) => {

const [users, setUsers] = useState(null)
 //   const [messages, setMessages] = useState([]);
 console.log(user)
//  
   const getUsers = async ()=> {
   const querySanp = await firestore().collection('users').where('uid','==',user.uid).get()
   const allUsers = querySanp.docs.map(docSnap=>docSnap.data())
  //  console.log(allUsers)
   setUsers(allUsers)
 }

 useEffect(()=>{
   getUsers()
 },[])

  return (
    <SafeAreaView>
      <View style={styles.Contain}>
      <FlatList
        data={users}
        keyExtractor={(item)=>item.uid}
        renderItem={({item}) => (
          <ScrollView>
            <View style={styles.card} >
                <Image style={styles.userImage} source={{uri: item.photo}} />
            </View><View style={styles.card} >
                <Text style={styles.nameText} >{item.name}</Text>
            </View></ScrollView>
        )}
        />
      <ScrollView>
      <View style={styles.card} >
        <View style={styles.textArea}>
          <Text style={styles.nameText} >{user.name}</Text>
          <Text style={styles.msgContent} >{user.email}</Text>
          <TouchableOpacity
            onPress={()=>auth().signOut()}
            style={[styles.signIn, {
                borderColor: '#D16002',
                borderWidth: 1,
                marginTop: 15,
            }]}>

            <Text style={[styles.textSign, {
                color: '#D16002'
            }]}> Log out </Text>

          </TouchableOpacity>
      </View>
    </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  card: {
    width: '100%',
    height: 'auto',
    marginHorizontal: 4,
    marginVertical: 6,
    paddingTop: 100,
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 200,
    height: 200,
    
  },
  userImageST: {
    width: 50,
    height: 50,
    borderRadius: 25,
  }, 
  textArea: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 10,
    width: 200,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  userText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '900',
    fontFamily: 'Verdana',
  },
  msgTime: {
    textAlign: 'right',
    fontSize: 11,
    marginTop: -20,
  },
  msgContent: {
    paddingTop: 5,
    textAlign: 'center',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default ProfileScreen;