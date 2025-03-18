/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  FlatList,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {GiftedChat,Bubble,InputToolbar} from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ScrollView } from 'react-native-virtualized-view';

const SearchScreen = ({user, navigation}) => {
  const [listings, setListings] = useState([]);
  // const mainuser = user[0]
  // console.log(uid, user.uid);

  const getListings = async ()=> {
    const querySanp = await firestore().collection('Listings').get()
    const allLists = querySanp.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        timestamp:docSnap.data().timestamp.toDate()
      }
    })
    setListings(allLists)
  }
  
  useEffect(()=>{
    getListings()
  },[])

  return (
      <SafeAreaView >
        <StatusBar />
         <ScrollView>
          <View style={styles.Contain}>
              <FlatList
                  data={listings}
                  keyExtractor={(item)=>item.uid}
                  renderItem={({item}) => (
                      <TouchableOpacity
                      onPress={() => navigation.navigate('Listing', {uid: item})}
                      >
                      <View style={styles.card} >
                          <Image style={styles.listImage} source={{uri: item.photo[0]}} /> 
                          <View style={styles.textArea}>
                          <Text style={styles.nameText} >{item.title}</Text>
                          <View style={styles.card} ><Text >{item.cat}</Text><Text >{item.ex_cat}</Text></View>
                          <Text style={styles.userText} >{item.desc}</Text>
                         </View>
                      </View>
                      </TouchableOpacity>
                  )}
                  />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
      Contain: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
      },
    Container: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    card: {
      width: '100%',
      height: 'auto',
      marginHorizontal: 4,
      marginVertical: 6,
      flexDirection: 'row',
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
      paddingTop: 15,
      paddingBottom: 15,
    },
    userImageST: {
      width: 50,
      height: 50,
      borderRadius: 25,
    }, 
    listImage: {
      width: 50,
      height: 50,
    }, 
    textArea: {
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 5,
      paddingLeft: 10,
      width: 300,
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
    },
    userText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    nameText: {
      fontSize: 14,
      fontWeight: '900',
      fontFamily: 'Verdana'
    },
    msgTime: {
      textAlign: 'right',
      fontSize: 11,
      marginTop: -20,
    },
    msgContent: {
      paddingTop: 5,
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

export default SearchScreen;