import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Button,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput,
    ScrollView
} from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import averagePriceInt from './Parser';

export default ListingCreationScreen = ({user, navigation}) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [cat, setCat] = useState('');
    const [ex_cat, setExcat] = useState('');
    const [data, setData] = React.useState({
        title: '',
        user_id: user.uid,
        desc: '',
        cat: '',
        ex_cat: '',
        photo: [''],
        timestamp: null,
        status: true,
        r_price: null
    });

    const confirmation = async () => {
      if(!title || !cat || !ex_cat || !desc) {
        alert("Заполните все поля")
      }
      try{
        const randCat = await fetch('https://thecatapi.com/api/images/get?format=src')
        const response = await fetch(
          `https://search.wb.ru/exactmatch/ru/common/v4/search?curr=rub&lang=ru&locale=ru&query=${encodeURIComponent(cat)}&resultset=catalog&page=0`
        )
        const data = await response.json()
        const products = data?.data?.products.slice(0,9)
        const prices = products.map((product) => product.salePriceU / 100)
        const avprice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        newdata = ({
            ... data,
            title: title,
            timestamp: new Date(),
            cat: cat,
            ex_cat: ex_cat,
            desc: desc,
            photo: [randCat.url],
            //r_price: avprice//averagePriceInt(cat)
        })
        firestore().collection('Listings').add(newdata)
        navigation.navigate('Own')
         }catch(err){
            console.log(err)
            alert('Неуспешно.')
      }
      }
      

    return (
        <View style={[styles.container, {
            paddingTop: 35
        }]}>
            <View style={styles.header}>
                <Text style={styles.text_header}>Создание предложения</Text>
                <Text style={styles.headerTitle}>Введите данные для создания объявления.</Text>
            </View>
            <View style={styles.footer}>
                
                <Text style={[styles.text_footer, {
                    marginTop: 25
                }]}>Название</Text>
                <View style={styles.action}>
                    <TextInput
                        placeholder="Введите название"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={title}
                        onChangeText={(text)=>{
                            console.log('set title') 
                            setTitle(text)}}
                    />
                </View>
                <Text style={[styles.text_footer, {
                    marginTop: 25
                }]}>Описание</Text>
                <View style={styles.action}>
                    <TextInput
                        placeholder="Введите описание"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={desc}
                        onChangeText={(text)=>{
                            console.log('set desc') 
                            setDesc(text)}}
                    />
                </View>
                <Text style={[styles.text_footer, {
                  marginTop: 25
                }]}>Предложение</Text>
                <View style={styles.action}>
                  <TextInput
                      placeholder="Выберите товар, который предлагаете"
                      style={styles.textInput}
                      autoCapitalize="none"
                      value={cat}
                      onChangeText={(text)=>{
                        console.log('set cat') 
                        setCat(text)}}
                  />
                </View>
                <Text style={[styles.text_footer, {
                    marginTop: 25
                }]}>Запрос</Text>
                <View style={styles.action}>
                    <TextInput
                        placeholder="Выберите товар, который хотите получить"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={ex_cat}
                        onChangeText={(text)=>{
                            console.log('set excat') 
                            setExcat(text)}}
                    />
                </View>

               
                    <TouchableOpacity
                        onPress={()=>confirmation()}
                        style={[styles.signIn, {
                            borderColor: '#D16002',
                            borderWidth: 1,
                            marginTop: 15,
                        }]}
                    >

                        <Text style={[styles.textSign, {
                            color: '#D16002'
                        }]}> Создать </Text>

                    </TouchableOpacity>
                    <View style={{marginTop: 10, alignItems: 'center'}}>
                    </View> 
                </View>

            </View>
    );
};



 const {height} = Dimensions.get("screen");
 const height_logo = height * 0.28;

 const styles = StyleSheet.create({ 
container: {
     flex: 1,
     backgroundColor: '#D16002'
   },
   header: {
     flex: 1,
     justifyContent: 'flex-end',
     paddingHorizontal: 20,
     paddingBottom: 50
     },
   footer: {
     flex: 3,
     backgroundColor: '#fff',
     borderTopLeftRadius: 30,
     borderTopRightRadius: 30,
     paddingVertical: 20,
     paddingHorizontal: 30
   },
   text_header: {
     color: '#fff',
     fontWeight: 'bold',
     fontSize: 30
   },
   text_footer: {
     color: '#05375a',
     fontSize: 18
   },
   title: {
     color: '#05375a',
     fontSize: 14,
     fontWeight: 'bold'
   },
   headerTitle: {
     paddingTop: 5,
     color: '#fff',
     fontSize: 14,
     fontWeight: 'bold'
   },
   action: {
     flexDirection: 'row',
     marginTop: 10,
     borderBottomWidth: 1,
     borderBottomColor: '#f2f2f2',
     paddingBottom: 5
   },
   textInput: { 
     flex: 1,
     marginTop: Platform.OS === 'ios' ? 0 : -12,
     paddingLeft: 10,
     color: '#05375a',
   },
   button: {
     alignItems: 'center',
     marginTop: 50
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
   }

 })