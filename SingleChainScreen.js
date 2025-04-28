import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SwipeableItem, { useSwipeableItemParams, OpenDirection } from 'react-native-swipeable-item';
import firestore from '@react-native-firebase/firestore';
import Icon from '@react-native-vector-icons/ionicons';
import { HOLDER } from '../conf';

const UnderlayLeft = ({ onNavigate }) => {
    const { item, close } = useSwipeableItemParams();
  
    const handleNavigate = () => {
      if (item && item.id) {
        onNavigate(item.id);
        close();
      }
    };
  
    return (
      <View style={styles.underlayLeft}>
        <TouchableOpacity onPress={handleNavigate}>
          <Text style={styles.underlayText}>Перейти</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const SingleChainScreen = ({ route, navigation }) => {
    const { chainId } = route.params;
    const [listings, setListings] = useState([]);
    const [mainOffer, setMainOffer] = useState('');
    const [mainRequest, setMainRequest] = useState('');
    const [chainName, setChainName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const itemRefs = useRef(new Map());
    
    useEffect(() => {
      let unsubscribe;
      const loadData = async () => {
        try {
          unsubscribe = firestore()
            .collection('Chains')
            .doc(chainId)
            .onSnapshot(async doc => {
              const data = doc.data();
              if (data) {
                setMainOffer(data.main_offer || '');
                setMainRequest(data.main_request || '');
                setChainName(data.name || '');
                
                if (data?.listings?.length) {
                  await fetchListingsDetails(data.listings);
                } else {
                  setListings([]);
                }
              }
            });
        } catch (error) {
          console.error("Ошибка загрузки данных цепочки:", error);
          Alert.alert("Ошибка", "Не удалось загрузить данные цепочки");
        }
      };
  
      loadData();
  
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [chainId]);
  
    const fetchListingsDetails = async (listingIds) => {
      try {
        const listingsData = await Promise.all(
          listingIds.map(async (id) => {
            const doc = await firestore().collection('Listings').doc(id).get();
            if (doc.exists) {
              return { id: doc.id, ...doc.data() };
            } else {
              console.warn(`Объявление с ID ${id} не найдено`);
              return null; 
            }
          })
        );
        setListings(listingsData.filter(listing => listing !== null));
      } catch (error) {
        console.error("Ошибка поиска объявлений:", error);
        Alert.alert("Ошибка", "Не удалось загрузить данные объявлений");
      }
    };
  
    const closeAllItems = () => {
      itemRefs.current.forEach((ref) => {
        if (ref && ref.close) {
          ref.close();
        }
      });
    };
  
    const handleDeleteListing = async (itemId) => {
      try {
        const newListings = listings.filter(l => l.id !== itemId);
        setListings(newListings);
  
        await firestore().collection('Chains').doc(chainId).update({
          listings: newListings.map(l => l.id)
        });
      } catch (error) {
        console.error("Ошибка удаления объявления:", error);
        Alert.alert("Ошибка", "Не удалось удалить элемент. Попробуйте снова.");
        fetchListingsDetails(listings.map(l => l.id));
      }
    };
  
    const handleNavigateToListing = (listingId) => {
      navigation.navigate('Listing', { uid: listingId });
    };
  
    const onChange = ({ openDirection, item }) => {
      if (openDirection !== OpenDirection.NONE && item?.id) {
        itemRefs.current.forEach((ref, key) => {
          if (key !== item.id && ref && ref.close) {
            ref.close();
          }
        });
      }
    };
  
    const renderItem = ({ item, drag, isActive }) => {
        if (!item || !item.id) return null;
      
        return (
          <SwipeableItem
            key={item.id}
            item={item}
            ref={ref => {
              if (ref) {
                itemRefs.current.set(item.id, ref);
              }
            }}
            onChange={({ openDirection }) => {
              if (openDirection === OpenDirection.LEFT) {
                handleNavigateToListing(item.id);
                const ref = itemRefs.current.get(item.id);
                if (ref && ref.close) ref.close();
              }
            }}
            renderUnderlayRight={() => null}
            renderUnderlayLeft={() => <UnderlayLeft onNavigate={handleNavigateToListing} />}
            snapPointsLeft={[100]}
            swipeEnabled={true}
          >
            <TouchableOpacity
              onLongPress={drag}
              delayLongPress={200}
              style={[styles.itemContainer, isActive && { backgroundColor: '#e0e0e0' }]}
              onPress={closeAllItems}
            >
              <Image
                source={{ uri: item.photo?.[0] || HOLDER }}
                style={styles.listingImage}
              />
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle}>{item.title || 'Без названия'}</Text>
                <Text>{item.cat?.sub || 'Без категории'}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteListing(item.id)}
                style={styles.deleteIconButton}
              >
                <Icon name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          </SwipeableItem>
        );
      };
  
    const handleDragEnd = async ({ data }) => {
      try {
        setListings(data);
        await firestore().collection('Chains').doc(chainId).update({
          listings: data.map(item => item.id)
        });
      } catch (error) {
        console.error("Ошибка обновления порядка:", error);
        Alert.alert("Ошибка", "Не удалось обновить порядок объявлений. Попробуйте снова.");
        fetchListingsDetails(listings.map(item => item.id));
      }
    };
  
    const saveChanges = async () => {
      try {
        await firestore().collection('Chains').doc(chainId).update({
          name: chainName,
          main_offer: mainOffer,
          main_request: mainRequest
        });
        setIsEditing(false);
        Alert.alert("Успешно", "Данные цепочки обновлены");
      } catch (error) {
        console.error("Ошибка обновления:", error);
        Alert.alert("Ошибка", "Не удалось обновить данные цепочки");
      }
    };
  
    return (
      <KeyboardAvoidingView
        behavior={"height"}
        style={{ flex: 1 }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerSection}>
              {isEditing ? (
                <TextInput
                  style={styles.nameInput}
                  value={chainName}
                  onChangeText={setChainName}
                  placeholder="Название цепочки"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.chainTitle}>{chainName}</Text>
              )}

              <TouchableOpacity 
                style={styles.editButton} 
                onPress={isEditing ? saveChanges : () => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>{isEditing ? "Сохранить" : "Изменить"}</Text>
              </TouchableOpacity>
            </View>
  
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Основное предложение:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={mainOffer}
                  onChangeText={setMainOffer}
                  multiline
                  placeholder="Введите ваше основное предложение"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.sectionText}>{mainOffer || "Не указано"}</Text>
              )}
            </View>
  
            <View style={styles.listContainer}>
              <Text style={styles.sectionTitle}>Объявления:</Text>
              <DraggableFlatList
                data={listings}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                onDragEnd={handleDragEnd}
                scrollEnabled={false} 
                ListEmptyComponent={() => (
                  <View style={styles.emptyList}>
                    <Text>Нет объявлений в этой цепочке</Text>
                  </View>
                )}
              />
            </View>
  
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Основной запрос:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={mainRequest}
                  onChangeText={setMainRequest}
                  multiline
                  placeholder="Введите ваш основной запрос"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.sectionText}>{mainRequest || "Не указано"}</Text>
              )}
            </View>
          </ScrollView>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
    },
    headerSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    chainTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
    },
    nameInput: {
      flex: 1,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 8,
      marginRight: 8,
      backgroundColor: 'white',
    },
    editButton: {
      backgroundColor: '#017D7D',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
    },
    editButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    sectionContainer: {
      marginBottom: 16,
      padding: 12,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    sectionText: {
      fontSize: 16,
      lineHeight: 22,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 8,
      backgroundColor: 'white',
      minHeight: 80,
      textAlignVertical: 'top',
    },
    listContainer: {
      marginBottom: 16,
    },
    emptyList: {
      padding: 16,
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    itemContainer: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: 'white',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    listingImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 16,
    },
    listingInfo: {
      flex: 1,
    },
    listingTitle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    deleteIconButton: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    underlayLeft: {
      flex: 1,
      backgroundColor: 'green',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    underlayText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  export default SingleChainScreen;