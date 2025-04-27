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


const mainThemeLight = {
  "colors": {
    "primary": "#228B22",
    "onPrimary": "rgb(3, 3, 3)",
    "primaryContainer": "rgb(240, 219, 255)",
    "onPrimaryContainer": "rgb(44, 0, 81)",
    "secondary": "rgb(102, 90, 111)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(237, 221, 246)",
    "onSecondaryContainer": "rgb(33, 24, 42)",
    "tertiary": "rgb(128, 81, 88)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(255, 217, 221)",
    "onTertiaryContainer": "rgb(50, 16, 23)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(29, 27, 30)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(29, 27, 30)",
    "surfaceVariant": "rgb(233, 223, 235)",
    "onSurfaceVariant": "rgb(74, 69, 78)",
    "outline": "rgb(124, 117, 126)",
    "outlineVariant": "rgb(204, 196, 206)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(50, 47, 51)",
    "inverseOnSurface": "rgb(245, 239, 244)",
    "inversePrimary": "rgb(220, 184, 255)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(248, 242, 251)",
      "level2": "rgb(244, 236, 248)",
      "level3": "rgb(240, 231, 246)",
      "level4": "rgb(239, 229, 245)",
      "level5": "rgb(236, 226, 243)"
    },
    "surfaceDisabled": "rgba(29, 27, 30, 0.12)",
    "onSurfaceDisabled": "rgba(29, 27, 30, 0.38)",
    "backdrop": "rgba(51, 47, 55, 0.4)"
  }
};
const mainThemeDark = {
  "colors": {
    "primary": "#228B22",
    "onPrimary": "rgb(71, 12, 122)",
    "primaryContainer": "rgb(95, 43, 146)",
    "onPrimaryContainer": "rgb(240, 219, 255)",
    "secondary": "rgb(208, 193, 218)",
    "onSecondary": "rgb(54, 44, 63)",
    "secondaryContainer": "rgb(77, 67, 87)",
    "onSecondaryContainer": "rgb(237, 221, 246)",
    "tertiary": "rgb(243, 183, 190)",
    "onTertiary": "rgb(75, 37, 43)",
    "tertiaryContainer": "rgb(101, 58, 65)",
    "onTertiaryContainer": "rgb(255, 217, 221)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(29, 27, 30)",
    "onBackground": "rgb(231, 225, 229)",
    "surface": "rgb(29, 27, 30)",
    "onSurface": "rgb(231, 225, 229)",
    "surfaceVariant": "rgb(74, 69, 78)",
    "onSurfaceVariant": "rgb(204, 196, 206)",
    "outline": "rgb(150, 142, 152)",
    "outlineVariant": "rgb(74, 69, 78)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(231, 225, 229)",
    "inverseOnSurface": "rgb(50, 47, 51)",
    "inversePrimary": "rgb(120, 69, 172)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(39, 35, 41)",
      "level2": "rgb(44, 40, 48)",
      "level3": "rgb(50, 44, 55)",
      "level4": "rgb(52, 46, 57)",
      "level5": "rgb(56, 49, 62)"
    },
    "surfaceDisabled": "rgba(231, 225, 229, 0.12)",
    "onSurfaceDisabled": "rgba(231, 225, 229, 0.38)",
    "backdrop": "rgba(51, 47, 55, 0.4)"
  }
};

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
    <PaperProvider theme={mainThemeLight}>
    <NavigationContainer>
      {session && session.user 
      ?
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
                  fontSize: 12,
                  textTransform: "uppercase",
                  flexWrap: "nowrap",
                  paddingTop: 10,
                  width: 70,
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
      : 
      <Stack.Navigator screenOptions={{headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="NewUserScreen" component={NewUserScreen} />
      </Stack.Navigator>
      }
    </NavigationContainer>
    </PaperProvider>
  )
}