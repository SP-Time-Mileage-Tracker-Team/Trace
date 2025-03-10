import { useState, useEffect } from 'react'
import { supabase } from './Supabase'
import LoginScreen from './Screens/Login'
import NewUserScreen from './Screens/NewUser'
import HomeScreen from './Screens/Home'
import RecordScreen from './Screens/Record';
import ReportScreen from './Screens/Report';
import ProfileScreen from './Screens/Profile';
import { Session } from '@supabase/supabase-js'
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native'
import TabBarIcon from './components/TabBarIcon';

import "./global.css"
import { PaperProvider } from 'react-native-paper'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <PaperProvider>
    <NavigationContainer>
      {session && session.user 
      ? 
      (isNewUser 
            ?
            <Stack.Navigator screenOptions={{headerShown: false }}>
              <Stack.Screen
                name="NewUserScreen"
                children={(props)=><NewUserScreen {...props} setIsNewUser={setIsNewUser} userId={session.user.id} />}
              />
            </Stack.Navigator>

            // ------------------------------------------
            // isNewUser === false
            // ------------------------------------------
            :
            <Stack.Navigator >
            <Stack.Screen
              name="Tab"
              options={{ headerShown: false }}
            >
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#339977",
                    tabBarInactiveTintColor: "#888888",
                    tabBarLabelStyle: {
                      fontSize: 14,
                      textTransform: "uppercase",
                      paddingTop: 10,
                    },
                    tabBarStyle: {
                      backgroundColor: "#FFFFFF",
                      borderTopWidth: 0,
                      marginBottom: 0,
                      shadowOpacity: 0.05,
                      shadowRadius: 10,
                      shadowColor: "#000000",
                      shadowOffset: { height: 0, width: 0 },
                    },
                  }}
                >
                  <Tab.Screen
                    name="Home"
                    children={()=><HomeScreen key={session.user.id} session={session}/>}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                          focused={focused}
                          iconName="home"
                          text="Home"
                        />
                      ),
                    }}
                  />

                  <Tab.Screen
                    name="Record"
                    component={RecordScreen}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                          focused={focused}
                          iconName="play"
                          text="Record"
                        />
                      ),
                    }}
                  />

                  <Tab.Screen
                    name="Report"
                    component={ReportScreen}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                          focused={focused}
                          iconName="trophy"
                          text="Report"
                        />
                      ),
                    }}
                  />

                  <Tab.Screen
                    name="Profile"
                    children={()=><ProfileScreen key={session.user.id} session={session}/>}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <TabBarIcon
                          focused={focused}
                          iconName="person"
                          text="Profile"
                        />
                      ),
                    }}
                  />
                  
                </Tab.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
          ) 
      : <LoginScreen />
      }
    </NavigationContainer>
    </PaperProvider>
  )
}