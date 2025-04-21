import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   ScrollView,
   StyleSheet,
   SafeAreaView,
   StatusBar,
   FlatList,
   Dimensions,
   Image
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { WhatsappSubscriber } from '../service/api';
import RenderHTML from 'react-native-render-html';
// import Icon from 'react-native-vector-icons/FontAwesome';
const { width } = Dimensions.get('window');
export default function Whatapp() {
   useEffect(() => {


      connectWhatap()

   }, []);
   const [getUserDiscussions, setUsersDiscussions] = useState([]);
   const navigation = useNavigation();
   const connectWhatap = async () => {
      const data = await WhatsappSubscriber();
      console.log('whtap', data.data)
      setUsersDiscussions(data.data.message)
   };
   const renderUserFollowUpItem = ({ item }) => (
      <View>

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

               {/* <View style={styles.dot} /> */}

               <View style={{ flex: 1 }}>
                  <Text style={styles.chatName}>{item.first_name + '\n' + item.chat_id} </Text>

                  {/* <RenderHTML
                     contentWidth={width}
                     source={{
                        html: `<p style="color:gray; font-size:13px;">${item?.last_update_data?.discussion}</p>`,
                     }}
                  /> */}
               </View>

               {/* <Text style={styles.chatTime}>
                  {item.followup_date }
               </Text> */}
            </View>
         </TouchableOpacity>

      </View>
   );
   return (

      <View >
         <FlatList
            data={getUserDiscussions}
            keyExtractor={(item) => item.subscriber_id}
            renderItem={renderUserFollowUpItem}
         />
      </View>
   )
}
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