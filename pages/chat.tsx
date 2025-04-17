import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { getUserDiscussionList, getUserDiscussionLists } from '../service/api';
import RenderHTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
   const chatData = {
      name: 'Emma Thompson',
      message: 'Thanks for the appointment confirmation!',
      time: '12:00',
      imageUrl: '', // try adding a link here to test image
   };
   // const messages = [
   //    {
   //       id: '1',
   //       text: 'Hey there!',
   //       sender: 'me',
   //       time: '12:00',
   //    },
   //    {
   //       id: '2',
   //       text: 'Hi! How are you?',
   //       sender: 'other',
   //       time: '12:01',
   //    },
   // ];
   const [message, setMessage] = useState('');
   const [fontSize, setFontSize] = useState(16);
   const [imageUri, setImageUri] = useState(null);
   const [date, setDate] = useState(new Date());
   const [showPicker, setShowPicker] = useState(false);
   const [getUserDiscussions, setUsersDiscussions] = useState([]);
   useEffect(() => {


      getUserDiscussion()


   }, []);
   const renderMessageItem = ({ item }) => (
      <View style={[styles.messageContainer, styles.messageRight]}>
         <View style={[styles.bubble, styles.bubbleRight]}>
            <View style={{ marginBottom: 8 }}>
               <View style={{ marginBottom: 1 }}>
                  {item.followup_time && item.followup_time !== "00:00:00" ? (
                     <Text style={{ color: 'black', fontSize: 12, marginBottom: 4 }}>
                        Follow Up: {item.followup_time}
                     </Text>
                  ) : ''}
                  {item.discussion ? (
                     <RenderHTML
                        contentWidth={width}
                        source={{ html: `<p style="color:#000; font-size:13px; background-color: white;">${item.discussion}</p>` }}
                        tagsStyles={{
                           p: { color: 'black' } // Ensure background for <p> tag as well
                        }}
                     />
                  ) : ''}

                  {item.assign_first_name ? (
                     <Text style={{ color: 'black', fontSize: 13 }}>{item.assign_first_name}</Text>
                  ) : ''}
                  {item.lead_status ? (
                     <Text style={{ color: 'black', fontSize: 13 }}>{item.lead_status}</Text>
                  ) : ''}
                  {item.product_name ? (
                     <Text style={{ color: 'black', fontSize: 13 }}>{item.product_name}</Text>
                  ) : ''}
                  {/* <Text style={{ color: 'gray', fontSize: 13 }}> </Text> */}


               </View>

            </View>


            {/* <RenderHTML contentWidth={width} source={{ html: `<p style="color:gray; font-size:13px;">${item.discussion}</p>` }} />
            <View>
               <Text >Follow Up:- {item.followup_time}</Text>
            </View> */}
            <Text style={styles.messageTime}> {item.created_at_time}</Text>
         </View>
         {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.chatAvatar} />
         ) : (
            <View style={styles.chatInitials}>
               <Text style={styles.initialsText}>
                  {item.first_name.charAt(0).toUpperCase()}
               </Text>
            </View>
         )}

      </View>
   );
   // const renderMessageItem = ({ item }) => {
   //    const isMe = item.sender === 'me';

   //    return (
   //       // <View
   //       //    style={[
   //       //       styles.messageContainer,
   //       //       isMe ? styles.messageRight : styles.messageLeft,
   //       //    ]}
   //       // >
   //       <View
   //          style={[
   //             styles.messageContainer,
   //             styles.messageRight
   //          ]}
   //       >
   //          <View style={[styles.bubble, styles.bubbleRight]}>
   //             {/* <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}> */}
   //             {/* <Text style={styles.messageText}>{item.text}</Text> */}
   //             <RenderHTML
   //                contentWidth={width}
   //                source={{ html: `<p style="color:gray; font-size:13px;">${item.discussion}</p>` }}
   //             />
   //             <Text style={styles.messageTime}>{item.time}</Text>
   //          </View>
   //       </View>
   //    );
   // };
   const renderChatInput = () => (
      <View style={styles.inputContainer}>
         <View style={styles.inputRow}>
            <TouchableOpacity onPress={pickImage}>
               <Text style={{ fontSize: 18, marginRight: 10 }}>📷</Text>
            </TouchableOpacity>

            <TextInput
               placeholder="Type a message"
               value={message}
               onChangeText={setMessage}
               style={[styles.textInput, { fontSize }]}
               multiline
            />

            <TouchableOpacity onPress={() => setFontSize(fontSize === 16 ? 22 : 16)}>
               <Text style={{ marginLeft: 10 }}>🅰️</Text>
            </TouchableOpacity>
         </View>

         {imageUri && (
            <Image
               source={{ uri: imageUri }}
               style={styles.previewImage}
            />
         )}

         <View style={styles.buttonRows}>
            <TouchableOpacity style={styles.button} onPress={() => console.log('Saved')}>
               {/* <Icon name="edit" size={20} color="#fff" /> */}
               <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            {/* <Button title="Save" onPress={() => console.log('Saved')} /> */}
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datetimeButton}>
               <Text style={styles.datetimeText}>
                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
               </Text>
            </TouchableOpacity>
         </View>

         {showPicker && (
            <DateTimePicker
               value={date}
               mode="datetime"
               display={Platform.OS === 'ios' ? 'inline' : 'default'}
               onChange={onChangeDate}
            />
         )}
      </View>
   );

   const pickImage = () => {
      ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
         if (response.assets && response.assets.length > 0) {
            setImageUri(response.assets[0].uri);
         }
      });
   };

   const getUserDiscussion = async () => {
      let payload = {
         business_id: 205, user_id
            :
            1131
      };
      const data = await getUserDiscussionLists(payload);
      console.log(data.data)
      setUsersDiscussions(data?.data ? data?.data : []);

   };
   const onChangeDate = (event, selectedDate) => {
      setShowPicker(false);
      if (selectedDate) setDate(selectedDate);
   };
   return (

      <ScrollView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity style={styles.menuIcon}>
               <Icon name="more-vert" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
               source={{ uri: 'https://i.imgur.com/2nCt3Sbl.png' }} // Replace with actual profile image
               style={styles.avatar}
            />
            <Text style={styles.name}>Christine Oliver</Text>
            <Text style={styles.subtitle}>Prefers almond milk latte with dark chocolate</Text>
            <View style={styles.actions}>
               <Icon name="videocam" size={24} style={styles.actionIcon} />
               <Icon name="chat" size={24} style={styles.actionIcon} />
               <Icon name="call" size={24} style={styles.actionIcon} />
            </View>
         </View>

         {/* Tabs */}
         <View style={styles.tabs}>
            <Text style={[styles.tab, styles.activeTab]}>Response </Text>
            <Text style={styles.tab}>Whatapp</Text>
            <Text style={styles.tab}>Deal</Text>
         </View>

         {/* Services */}
         {/* <View style={styles.services}>
            <Text style={styles.serviceItem}>● Evening makeup</Text>
            <Text style={[styles.serviceItem, { color: '#00C58D' }]}>● Hollywood wave hairstyle</Text>
         </View> */}

         {/* Total Sum */}
         {/* <View style={styles.total}>
            <Text style={styles.totalLabel}>Total sum</Text>
            <Text style={styles.totalAmount}>270 USD</Text>
         </View> */}

         {/* Buttons */}
         {/* <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
               <Icon name="edit" size={20} color="#fff" />
               <Text style={styles.buttonText}>EDIT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
               <Icon name="content-copy" size={20} color="#fff" />
            </TouchableOpacity>
         </View> */}

         {/* Recent Chats */}
         {/* <View style={styles.chats}>
            <Text style={styles.chatTitle}>Recent Chats</Text>
            <View style={styles.chatItem}>
             
               {chatData.imageUrl ? (
                  <Image
                     source={{ uri: chatData.imageUrl }}
                     style={styles.chatAvatar}
                  />
               ) : (
                  <View style={styles.chatInitials}>
                     <Text style={styles.initialsText}>
                        {chatData.name.charAt(0).toUpperCase()}
                     </Text>
                  </View>
               )}
               <View style={styles.dot} />
               <View>
                  <Text style={styles.chatName}>Emma Thompson</Text>
                  <Text style={styles.chatMessage}>Thanks for the appointment confirmation!</Text>
               </View>
               <Text style={styles.chatTime}>12:00</Text>
            </View>
         </View> */}
         {/* <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatContainer}
         /> */}
         {/* --------------------- Message Input Area --------------------- */}
         <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
         >
            <View style={{ flex: 1 }}>
               <ScrollView style={styles.container}>
                  {/* all existing UI here except the input box */}
                  <FlatList
                     data={getUserDiscussions}
                     renderItem={renderMessageItem}
                     keyExtractor={(item) => item.id}
                     contentContainerStyle={styles.chatContainer}
                  />


               </ScrollView>

               {/* Chat Input fixed at bottom */}
               {renderChatInput()}
            </View>
         </KeyboardAvoidingView>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#fff' },
   chatContainer: {
      padding: 10,
   },

   messageContainer: {
      flexDirection: 'row',
      marginVertical: 4,
   },

   messageLeft: {
      justifyContent: 'flex-start',
   },

   messageRight: {
      justifyContent: 'flex-end',
   },

   bubble: {
      maxWidth: '75%',
      padding: 10,
      borderRadius: 15,
   },

   bubbleLeft: {
      backgroundColor: '#e5e5e5',
      borderTopLeftRadius: 0,
      alignSelf: 'flex-start',
   },

   bubbleRight: {
      backgroundColor: '#e5fde3',

      borderTopRightRadius: 0,
      alignSelf: 'flex-end',
   },

   messageText: {
      fontSize: 15,
      marginBottom: 1,

   },

   messageTime: {
      fontSize: 10,
      color: 'gray',
      textAlign: 'right',
      marginHorizontal: 5,
   },
   header: {
      backgroundColor: 'linear-gradient(45deg,rgb(184, 31, 255), #21D4FD)', // Add gradient manually or use Expo's LinearGradient
      alignItems: 'center',
      paddingVertical: 20,
      position: 'relative',
   },
   menuIcon: { position: 'absolute', top: 10, right: 10 },
   avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: '#fff', marginBottom: 10 },
   name: { fontWeight: 'bold', fontSize: 18 },
   subtitle: { fontSize: 12, color: 'white', textAlign: 'center', marginVertical: 5 },
   actions: { flexDirection: 'row', marginVertical: 10 },
   actionIcon: { marginHorizontal: 10, color: '#a279ff' },

   tabs: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
   tab: { fontSize: 14, color: 'gray' },
   activeTab: { color: '#a279ff', fontWeight: 'bold', borderBottomWidth: 2, borderColor: '#a279ff' },

   services: { paddingHorizontal: 20, marginVertical: 10 },
   serviceItem: { fontSize: 14, marginBottom: 5, color: '#5A5A5A' },

   total: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginVertical: 10 },
   totalLabel: { fontSize: 14, color: '#444' },
   totalAmount: { fontWeight: 'bold', color: '#00A86B' },

   buttonRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
   button: {
      backgroundColor: '#a279ff',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      marginRight: 10,
   },
   buttonText: { color: '#fff', marginLeft: 5 },
   iconButton: {
      backgroundColor: '#a279ff',
      padding: 10,
      borderRadius: 10,
   },

   chats: { padding: 20 },
   chatTitle: { fontWeight: 'bold', marginBottom: 10 },
   chatItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
   dot: {
      width: 10, height: 10, borderRadius: 5, backgroundColor: '#0f0', marginRight: 10,
   },
   chatName: { fontWeight: 'bold' },
   chatMessage: { fontSize: 12, color: 'gray' },
   chatTime: { fontSize: 12, color: 'gray' },
   chatAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#eee',
   },

   chatInitials: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
   },

   initialsText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
   },
   inputContainer: {
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderColor: '#ddd',

   },

   inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
   },

   textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginVertical: 8,
      maxHeight: 100,
   },

   previewImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginVertical: 10,
   },

   buttonRows: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },

   datetimeButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: '#eee',
      borderRadius: 8,
   },

   datetimeText: {
      color: 'blue',
   },

});
