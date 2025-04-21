import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { getUser, getUserDiscussionList } from '../service/api';
import RenderHTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import Whatapp from './whatap';
const { width } = Dimensions.get('window');

// Mock User Data
const mockUsers = [
   {
      id: '1',
      name: 'Amit Sharma',
      message: 'Hey, how are you?',
      time: '10:15 AM',
      avatar: 'https://i.pravatar.cc/150?img=1',
   },
   {
      id: '2',
      name: 'Priya Mehra',
      message: 'Let’s catch up later!',
      time: '9:45 AM',
      avatar: 'https://i.pravatar.cc/150?img=2',
   },
   {
      id: '3',
      name: 'Rohan Singh',
      message: 'Got your file!',
      time: 'Yesterday',
      avatar: 'https://i.pravatar.cc/150?img=3',
   },
];

const TabExample = () => {
   const [activeTab, setActiveTab] = useState('tab1');
   const [users, setUsers] = useState([]);
   const [getUserDiscussions, setUsersDiscussions] = useState([]);
   const [followUp, setFollowUp] = useState([]);
   const navigation = useNavigation();
   useEffect(() => {
      if (activeTab === 'tab1') {
         // Simulate fetch
         setTimeout(() => {
            getUserList()
            getUserDiscussion()
            // setUsers(mockUsers);
         }, 500);
      }
   }, [activeTab]);
   const getUserList = async () => {
      let payload = { business_id: 205 };
      const data = await getUser(payload);
      console.log(data.data)
      setUsers(data?.data ? data?.data : []);

   };


   const getUserDiscussion = async () => {
      let payload = { business_id: 205 };
      const data = await getUserDiscussionList(payload);
      console.log(data.data)
      setUsersDiscussions(data?.data ? data?.data : []);

   };
   const getUserfollowUp = async () => {
      let payload = { business_id: 205 };
      const data = await getUserDiscussionList(payload);
      console.log(data.data)
      setUsersDiscussions(data?.data ? data?.data : []);

   };
   const renderUserItem = ({ item }) => (
      <TouchableOpacity
         onPress={() => navigation.navigate('Chat', { id: item.id })}>
         <View style={styles.chatItem}>
            {item.imageUrl ? (
               <Image source={{ uri: item.imageUrl }} style={styles.chatAvatar} />
            ) : (
               <View style={styles.chatInitials}>
                  <Text style={styles.initialsText}>
                     {item.first_name.charAt(0).toUpperCase()}
                  </Text>
               </View>
            )}

            <View style={styles.dot} />

            <View style={{ flex: 1 }}>
               <Text style={styles.chatName}>{item.first_name} </Text>
               {/* <Text style={styles.chatMessage}>{item.message}</Text> */}
               <RenderHTML
                  contentWidth={width}
                  source={{ html: `<p style="color:gray; font-size:13px;">${item?.last_update_data.discussion}</p>` }}
               />
            </View>
            <Text style={styles.chatTime}> {item.created_at_date + '\n' + item.created_at_time}</Text>

         </View>
      </TouchableOpacity>
   );
   const renderUserFollowUpItem = ({ item }) => (
      <View>
         {item.followup_date && (
            <TouchableOpacity onPress={() => navigation.navigate('Chat', { id: item.id })}>
               <View style={styles.chatItem}>
                  {item.imageUrl ? (
                     <Image source={{ uri: item.imageUrl }} style={styles.chatAvatar} />
                  ) : (
                     <View style={styles.chatInitials}>
                        <Text style={styles.initialsText}>
                           {item.first_name.charAt(0).toUpperCase()}
                        </Text>
                     </View>
                  )}

                  <View style={styles.dot} />

                  <View style={{ flex: 1 }}>
                     <Text style={styles.chatName}>{item.first_name} </Text>

                     <RenderHTML
                        contentWidth={width}
                        source={{
                           html: `<p style="color:gray; font-size:13px;">${item?.last_update_data?.discussion}</p>`,
                        }}
                     />
                  </View>

                  <Text style={styles.chatTime}>
                     {item.followup_date + '\n' + item.followup_time}
                  </Text>
               </View>
            </TouchableOpacity>
         )}
      </View>
   );
   return (
      <View style={styles.container}>
         {/* Tabs */}
         <View style={styles.tabss}>
            <TouchableOpacity
               onPress={() => setActiveTab('tab1')}
               style={[activeTab === 'tab1' && styles.activeTab]}
            >
               <Text style={styles.tabText}>Inbox</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => setActiveTab('tab2')}
               style={[activeTab === 'tab2' && styles.activeTab]}
            >
               <Text style={styles.tabText}>Whataap</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() => setActiveTab('tab3')}
               style={[activeTab === 'tab3' && styles.activeTab]}
            >
               <Text style={styles.tabText}>Follow up</Text>
            </TouchableOpacity>
         </View>


         {/* Tab Content */}
         <View style={styles.content}>
            {activeTab === 'tab1' && (
               <FlatList
                  data={getUserDiscussions}
                  keyExtractor={(item) => item.id}
                  renderItem={renderUserItem}
               />
            )}
            {activeTab === 'tab2' && <Whatapp></Whatapp>}

            {activeTab === 'tab3' && (
               <FlatList
                  data={getUserDiscussions}
                  keyExtractor={(item) => item.id}
                  renderItem={renderUserFollowUpItem}
               />
            )}
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, paddingTop: 10, backgroundColor: '#fff' },
   tabs: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
   avatarFallback: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
   },
   avatarText: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold',
   },

   // tabButton: {
   //    paddingVertical: 10,
   //    paddingHorizontal: 20,
   //    marginHorizontal: 5,
   //    borderRadius: 5,
   //    backgroundColor: '#e0e0e0',
   // },
   tabss: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
   tab: { fontSize: 14, color: 'gray' },
   activeTab: { color: '#a279ff', fontWeight: 'bold', borderBottomWidth: 2, borderColor: '#a279ff' },
   // activeTab: { backgroundColor: '#007bff' },
   tabText: { color: '#000' },
   content: { flex: 1, padding: 10 },

   // User list styling
   userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: '#ccc',
      paddingBottom: 10,
   },
   avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
   userInfo: { flex: 1 },
   userName: { fontSize: 16, fontWeight: 'bold' },
   message: { fontSize: 14, color: '#555' },
   time: { fontSize: 12, color: '#999' },
   chatMessage: { fontSize: 12, color: 'gray' },
   chatTime: { fontSize: 12, color: 'gray', textAlign: 'center' },
   chats: { padding: 20 },
   chatTitle: { fontWeight: 'bold', marginBottom: 10 },
   chatItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
   dot: {
      width: 10, height: 10, borderRadius: 5, backgroundColor: '#0f0', marginRight: 4, marginTop: 10
   },
   chatName: { fontWeight: 'bold' },
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

   // tabss: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
   // tab: { fontSize: 14, color: 'gray' },
});

export default TabExample;

