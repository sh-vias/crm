import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { getUserDiscussionList, getUserDiscussionLists, singleUserProfile } from '../service/api';
import RenderHTML from 'react-native-render-html';
import { useNavigation, useRoute } from '@react-navigation/native';
import Whatapp from './whatap';
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
   const route = useRoute();
   const { id } = route.params;
   console.log("id", id)
   const chatData = {
      name: 'Emma Thompson',
      message: 'Thanks for the appointment confirmation!',
      time: '12:00',
      imageUrl: '', // try adding a link here to test image
   };

   const [activeTab, setActiveTab] = useState('tab1');
   const [message, setMessage] = useState('');
   const [users, setUsers] = useState([]);
   const [fontSize, setFontSize] = useState(16);
   const [imageUri, setImageUri] = useState(null);
   const [date, setDate] = useState(new Date());
   const [showPicker, setShowPicker] = useState(false);
   const [getUserDiscussions, setUsersDiscussions] = useState([]);
   useEffect(() => {


      getUserDiscussion()
      getUserProfile()

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
   const getUserProfile = async () => {
      let payload = { user_id: id };
      const data = await singleUserProfile(payload);
      console.log(data.data)
      setUsers(data?.data ? data?.data : []);

   };
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
            id
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

      <View style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity style={styles.menuIcon}>
               <Icon name="more-vert" size={24} color="#fff" />
            </TouchableOpacity>
            <Image
               source={{ uri: users.image }} // Replace with actual profile image
               style={styles.avatar}
            />
            <Text style={styles.name}>{users.first_name}</Text>
            <Text style={styles.subtitle}>{users.phone}, {users.email}</Text>
            <View style={styles.actions}>
               <Icon name="videocam" size={24} style={styles.actionIcon} />
               <Icon name="chat" size={24} style={styles.actionIcon} />
               <Icon name="call" size={24} style={styles.actionIcon} />
            </View>
         </View>

         {/* Tabs */}
         {/* <View style={styles.tabs}>
            <Text style={[styles.tab, styles.activeTab]}>Response </Text>
            <Text style={styles.tab}>Whatapp</Text>
            <Text style={styles.tab}>Deal</Text>
         </View> */}
         <View style={styles.tabs}>
            <TouchableOpacity
               onPress={() => setActiveTab('tab1')}
               style={[activeTab === 'tab1' && styles.activeTab]}
            >
               <Text style={[styles.tab]}>Response </Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => setActiveTab('tab2')}
               style={[activeTab === 'tab2' && styles.activeTab]}
            >
               <Text style={styles.tab}>Whatapp</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => setActiveTab('tab3')}
               style={[activeTab === 'tab3' && styles.activeTab]}
            >
               <Text style={styles.tab}>Deal</Text>
            </TouchableOpacity>
         </View>
         <View style={styles.content}>
            {activeTab === 'tab1' && (
               <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
               >
                  <View style={{ flex: 1 }}>
                     {/* <ScrollView > */}
                     {/* all existing UI here except the input box */}
                     <FlatList style={styles.container}
                        data={getUserDiscussions}
                        renderItem={renderMessageItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.chatContainer}
                     />


                     {/* </ScrollView> */}

                     {/* Chat Input fixed at bottom */}
                     {renderChatInput()}
                  </View>
               </KeyboardAvoidingView>
            )}
            {activeTab === 'tab2' && <Whatapp></Whatapp>}

            {activeTab === 'tab3' && (
               <Text>Helo</Text>
            )}
         </View>
         {/* --------------------- Message Input Area --------------------- */}

      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#fff' },
   chatContainer: {
      padding: 10,
   },
   content: { flex: 1, padding: 10 },
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
   name: { fontWeight: 'bold', fontSize: 18, color: 'white' },
   subtitle: { fontSize: 12, color: 'white', textAlign: 'center', marginVertical: 5, fontWeight: 'bold' },
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
