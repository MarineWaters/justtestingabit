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
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {GiftedChat,Bubble,InputToolbar} from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ScrollView } from 'react-native-virtualized-view';

const ListingScreen = ({user, route}) => {
  const [list, setList] = useState([]);
  const {uid} = route.params;
  // const mainuser = user[0]
  console.log('uid',uid.title)

  const getAllInfo = async () => {
    const listInfo = await firestore().collection('Listings').doc(uid)
.get()
    const allInfo = listInfo.docs.map(docSanp => {
      return {
        ...docSanp.data(),
        timestamp:docSanp.data().timestamp.toDateString()
      }
    })
    console.log('look here',docSanp.data().timestamp.toDateString())
    setList(allInfo)
  }
  
  useEffect(() => {
    getAllInfo()
  },[]);


  return (
    <SafeAreaView>
    <View style={styles.Contain}>
    <ScrollView>
    <View style={styles.card} >
        <Image style={styles.imageContainer} source={{uri: uid.photo[0]}} />
        <View style={styles.textArea}>
        <Text style={styles.nameText} >{uid.title}</Text>
        <View style={styles.card} ><Text >{uid.cat}</Text><Text >{uid.ex_cat}</Text></View>
        <Text style={styles.userText} >{uid.desc}</Text>
        <Text style={styles.msgTime}>{uid.timestamp.toDateString()}</Text>
      </View>
  </View>
    </ScrollView>
    </View>
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

export default ListingScreen;