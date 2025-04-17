import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';
import LoginScreen from '../pages/login';
// import TabExample from '../pages/home';
import ProfileScreen from '../pages/chat';
import TabExample from '../pages/home';



const Stack = createNativeStackNavigator();

const Navigator = () => {
   return (
      <NavigationContainer>
         <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Chat" component={ProfileScreen} />
            <Stack.Screen name="Home" component={TabExample} />
         </Stack.Navigator>
      </NavigationContainer>
   );
};

export default Navigator;


const styles = StyleSheet.create({
   mr15: {
      marginRight: 15,
   },
});