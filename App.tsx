import { useState, useEffect } from 'react'
import { supabase } from './Supabase'
import LoginScreen from './Screens/LoginScreen'
import HomeScreen from './Screens/HomeScreen'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <HomeScreen key={session.user.id} session={session} /> : <LoginScreen />}
    </View>
  )
}