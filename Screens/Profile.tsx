import { useState, useEffect } from 'react'
import { supabase } from '../Supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Button, TextInput } from 'react-native-paper'

export default function ProfileScreen({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='flex flex-rows mt-20 mb-20 p-5 w-full justify-center'>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput 
          mode='outlined'
          label="Email" 
          value={session?.user?.email} 
          disabled 
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput 
          mode='outlined'
          label="Username" 
          value={username || ''} 
          onChangeText={(text) => setUsername(text)} 
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput 
          mode='outlined'
          label="Website" 
          value={website || ''} 
          onChangeText={(text) => setWebsite(text)} 
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          mode='contained'
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <Button 
          mode='outlined'
          onPress={() => supabase.auth.signOut()} >
          Sign Out
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