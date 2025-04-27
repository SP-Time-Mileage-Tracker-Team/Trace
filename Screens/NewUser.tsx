import React, { useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native';
import { supabase } from '../Supabase'
import { Button, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

export default function NewUserScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)

    navigation.navigate("LoginScreen")
  }

  return (
    <View className='flex flex-rows mt-20 mb-20 p-5 w-full justify-center'>
      <Text className='w-full h-16 text-5xl font-bold text-[#228B22] text-center'>
        New User
      </Text>
      <View className='flex flex-rows mt-20 mb-20 p-5 w-full justify-center'>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <TextInput
            mode='outlined'
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <TextInput
            mode='outlined'
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <TextInput
            mode='outlined'
            onChangeText={(text) => setRetypePassword(text)}
            value={retypePassword}
            secureTextEntry={true}
            placeholder="Re-Type Password"
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Button 
            mode='contained'
            disabled={loading} 
            onPress={() => signUpWithEmail()}>
            Sign Up
          </Button>
        </View>
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  mt20: {
    marginTop: 20,
  },
});
