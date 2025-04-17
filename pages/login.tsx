import React, { useState } from 'react';
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   ScrollView,
   StyleSheet,
   SafeAreaView,
   StatusBar
} from 'react-native';
import { LoginUser } from '../service/api';
import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = () => {
   const [isLogin, setIsLogin] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(true);
   const [emailError, setEmailError] = useState('');
   const [passwordError, setPasswordError] = useState('');
   const [confirmPasswordError, setConfirmPasswordError] = useState('');
   const navigation = useNavigation();
   const validateEmail = (email: any) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
   };

   const handleEmailChange = (value: any) => {
      setEmail(value);
      if (value && !validateEmail(value)) {
         setEmailError('Please enter a valid email address');
      } else {
         setEmailError('');
      }
   };

   const handlePasswordChange = (value: any) => {
      setPassword(value);
      if (value && value.length < 8) {
         setPasswordError('Password must be at least 8 characters');
      } else {
         setPasswordError('');
      }
   };

   const handleConfirmPasswordChange = (value: any) => {
      setConfirmPassword(value);
      if (value && value !== password) {
         setConfirmPasswordError('Passwords do not match');
      } else {
         setConfirmPasswordError('');
      }
   };

   const handleSubmit = async () => {
      let isValid = true;
      if (!email) {
         setEmailError('Email is required');
         isValid = false;
      } else if (!validateEmail(email)) {
         setEmailError('Please enter a valid email address');
         isValid = false;
      }

      if (!password) {
         setPasswordError('Password is required');
         isValid = false;
      } else if (password.length < 8) {
         setPasswordError('Password must be at least 8 characters');
         isValid = false;
      }

      if (!isLogin && !confirmPassword) {
         setConfirmPasswordError('Please confirm your password');
         isValid = false;
      } else if (!isLogin && password !== confirmPassword) {
         setConfirmPasswordError('Passwords do not match');
         isValid = false;
      }

      if (isValid) {

         // console.log('Form submitted:', { email, password });

         const data = await LoginUser({ email_or_phone: email, password });
         // console.log("login", data)
         navigation.navigate('Home')

         setEmail('');
         setPassword('');
         setConfirmPassword('');
      }
   };

   const toggleMode = () => {
      setIsLogin(!isLogin);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setEmailError('');
      setPasswordError('');
      setConfirmPasswordError('');
   };

   return (
      <SafeAreaView style={styles.safeArea}>
         <StatusBar barStyle="dark-content" backgroundColor="#fff" />
         <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
            <Text style={styles.subHeader}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

            <View style={styles.inputContainer}>
               <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  style={[styles.input, emailError && styles.inputError]}
                  keyboardType="email-address"
               />
               {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

               <View>
                  <TextInput
                     placeholder="Password"
                     value={password}
                     onChangeText={handlePasswordChange}
                     style={[styles.input, passwordError && styles.inputError]}
                     secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                     style={styles.eyeIcon}
                     onPress={() => setShowPassword(!showPassword)}
                  >

                     {/* <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#888" /> */}
                  </TouchableOpacity>
               </View>
               {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

               {!isLogin && (
                  <>
                     <TextInput

                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={handleConfirmPasswordChange}
                        style={[styles.input, confirmPasswordError && styles.inputError]}
                        secureTextEntry={!showPassword}
                     />
                     {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                  </>
               )}

               {isLogin && (
                  <TouchableOpacity>
                     <Text style={styles.forgot}>Forgot Password?</Text>
                  </TouchableOpacity>
               )}

               <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
               </TouchableOpacity>

               <Text style={styles.or}>or continue with</Text>

               <View style={styles.socialContainer}>
                  <TouchableOpacity style={[styles.socialButton, styles.google]}>
                     {/* <Icon name="google" size={20} color="#EA4335" /> */}
                     <Text style={styles.socialText}> Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialButton, styles.apple]}>
                     {/* <Icon name="apple" size={20} color="#fff" /> */}
                     <Text style={[styles.socialText, { color: '#fff' }]}> Apple</Text>
                  </TouchableOpacity>
               </View>

               {!isLogin && (
                  <Text style={styles.terms}>
                     By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </Text>
               )}

               <TouchableOpacity onPress={toggleMode}>
                  <Text style={styles.toggleText}>
                     {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                  </Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: '#fff',
   },
   container: {
      padding: 20,
      justifyContent: 'center',
   },
   header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#4F46E5',
      textAlign: 'center',
      marginBottom: 4,
   },
   subHeader: {
      fontSize: 16,
      textAlign: 'center',
      color: '#555',
      marginBottom: 20,
   },
   inputContainer: {
      marginTop: 10,
   },
   input: {
      height: 48,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 10,
   },
   inputError: {
      borderColor: 'red',
   },
   errorText: {
      color: 'red',
      fontSize: 12,
      marginBottom: 6,
   },
   eyeIcon: {
      position: 'absolute',
      right: 12,
      top: 12,
   },
   forgot: {
      textAlign: 'right',
      color: '#4F46E5',
      fontSize: 12,
      marginBottom: 20,
   },
   button: {
      backgroundColor: '#4F46E5',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
   },
   buttonText: {
      color: '#fff',
      fontWeight: '600',
   },
   or: {
      textAlign: 'center',
      color: '#888',
      marginVertical: 10,
   },
   socialContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 6,
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 5,
   },
   google: {
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
   },
   apple: {
      backgroundColor: '#000',
   },
   socialText: {
      fontSize: 14,
   },
   terms: {
      textAlign: 'center',
      fontSize: 12,
      color: '#888',
      marginTop: 10,
   },
   toggleText: {
      textAlign: 'center',
      color: '#4F46E5',
      marginTop: 20,
      fontSize: 14,
   },
});

export default LoginScreen;