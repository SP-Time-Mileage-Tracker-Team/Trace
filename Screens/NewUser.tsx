import React, { useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native';
import { supabase } from '../Supabase'
import { Button, TextInput } from 'react-native-paper'

export default function NewUserScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
  }

  return (
    <View className='flex flex-rows mt-20 mb-20 p-5 w-full justify-center'>
      <Text className='w-4/5 h-16 text-2xl text-white bg-[#228B22] text-center'>
        New User
      </Text>
    <View style={[styles.verticallySpaced, styles.mt20]}>
      <Text>Email</Text>
      <TextInput
        mode='outlined'
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email@address.com"
        autoCapitalize={'none'}
      />
    </View>
    <View style={styles.verticallySpaced}>
      <Text>Password</Text>
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
      <Text>Re-Type Password</Text>
      <TextInput
        mode='outlined'
        onChangeText={(text) => setPassword(text)}
        value={password}
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
