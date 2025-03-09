import React, { useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native';
import { supabase } from '../Supabase'
import { Button, Input } from '@rneui/themed'

export default function NewUserScreen({setIsNewUser, userId}) {
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
    <View style={styles.container}>
    <View style={[styles.verticallySpaced, styles.mt20]}>
      <Text>Email</Text>
      <Input
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email@address.com"
        autoCapitalize={'none'}
      />
    </View>
    <View style={styles.verticallySpaced}>
      <Text>Password</Text>
      <Input
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize={'none'}
      />
    </View>
    <View style={styles.verticallySpaced}>
      <Text>Re-Type Password</Text>
      <Input
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Re-Type Password"
        autoCapitalize={'none'}
      />
    </View>
    <View style={styles.verticallySpaced}>
      <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
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
