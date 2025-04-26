import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Image } from 'react-native'
import { supabase } from '../Supabase'
import { Button, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

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
      <Image 
      className='flex w-full h-80'
      source={require('../assets/icon.png')}
      />
      <TextInput
        mode='outlined'
        className='flex'
        label="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize={'none'}
      />
      <TextInput
        mode='outlined'
        label="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        autoCapitalize={'none'}
      />
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button 
        mode='contained'
        disabled={loading} 
        onPress={() => signInWithEmail()}>
          Sign In
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button 
        mode='outlined'
        disabled={loading} 
        onPress={() => navigation.navigate("NewUserScreen")}>
          Register
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})