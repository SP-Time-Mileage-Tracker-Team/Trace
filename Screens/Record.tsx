import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-paper';
import * as Location from 'expo-location';
import * as TaskManager from "expo-task-manager"
import { supabase } from '../Supabase'
import { Session } from '@supabase/supabase-js'

const TASK_NAME = "BACKGROUND_LOCATION_TASK"
const DEFAULT_LATITUDE = 33.0;
const DEFAULT_LONGITUDE = -83.48;
const INITIAL_REGION = {
  latitude: DEFAULT_LATITUDE,
  longitude: DEFAULT_LONGITUDE,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function RecordScreen({ session }: { session: Session }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [timerText, setTimerText] = useState("");
  const startTimeRef = useRef(0);
  const [activityName, setActivityName] = useState("Walking");
  const [routeCoordinates, setRouteCoordinates] = useState<Array<LatLng>>([]);
  const [startTime, setStartTime] = useState<any>();
  const [endTime, setEndTime] = useState<any>();
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [followUserLocation, setFollowUserLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  async function saveRecordedActivity(
    activity_name: string, 
    route_coordinates: any, 
    start_time: any, 
    end_time: any, 
    user_id: any) 
  {
    const { error } = await supabase
      .from('RecordedActivities')
      .insert({ 
        "activity_name": activity_name, 
        "route_coordinates": route_coordinates,
        "start_time": start_time,
        "end_time": end_time,
        "user_id": user_id}
      );

      console.log(error);
  }

  async function requestLocationPermissions() {
    const foregroundPermission = await Location.requestForegroundPermissionsAsync();

    if (!foregroundPermission.granted) {
      setErrorMsg('Permission to access location in foreground was denied');
      return;
    }

    const backgroundPermission = await Location.getBackgroundPermissionsAsync()

    if (!backgroundPermission.granted) {
      setErrorMsg('Permission to access location in background was denied');
      return;
    }

    setHasLocationPermission(true);

    // let location = await Location.getCurrentPositionAsync({});
    // setLocation(location);
    
    // const newCoords = { latitude: location.coords.latitude, longitude: location.coords.longitude };

    // setRouteCoordinates((prevCoords:any) => [...prevCoords, newCoords]);
    // //console.log(location);

    // console.log(routeCoordinates);
  }

  TaskManager.defineTask(TASK_NAME, async ({ data, error } :any) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data?.locations?.length) {
      
      const { locations } = data;
      const location = locations[0];
  
      if (location) {
        // Do something with location...
        setLocation(location);

        // format route coordinates as [{"longitude": ..., "latitude": ...}]

        const coords = locations.map(loc => ({
          "latitude": loc.coords.latitude,
          "longitude": loc.coords.longitude,
        }));

        setRouteCoordinates(prev => [...prev, ...coords]);

        console.log(routeCoordinates);
      }
      
    }
  });

  useEffect(() => {
    requestLocationPermissions();

    let interval : any;
    if(recording) {
      startTimeRef.current = Date.now() - time;
      interval = setInterval(() => {
        const now = Date.now();
        setTime(now - startTimeRef.current);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording]);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  //console.log(text);

  const handlePressRecord = () => {
    if (recording) {
      setEndTime(new Date().toISOString());
      console.log("Stop recording");
      setRecording(false);
      setShowUserLocation(false);
      setFollowUserLocation(false);
      Location.stopLocationUpdatesAsync(TASK_NAME)

      // -------------
      // save activity
      // -------------
      saveRecordedActivity(
        activityName, 
        routeCoordinates, 
        startTime, 
        endTime, 
        session.user.id);
    } else {
      setStartTime(new Date().toISOString());
      console.log("Start recording");

      if (hasLocationPermission) {
        setRecording(true);
        setShowUserLocation(true);
        setFollowUserLocation(true);
        Location.startLocationUpdatesAsync(TASK_NAME, {
          // The following notification options will help keep tracking consistent
          
          accuracy: Location.Accuracy.Highest,
          // timeInterval: 1000,
          // distanceInterval: 0,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Location",
            notificationBody: "Location tracking in background",
            notificationColor: "#FF0000",
          },
          pausesUpdatesAutomatically: false,
          // deferredUpdatesInterval: 1000,
          // deferredUpdatesDistance: 0,
          // deferredUpdatesTimeout: 1000,
        })
      }
      else {
        setRecording(false);
        requestLocationPermissions();
      }

      // save?
      setTime(0);
    }
  };
  
  const handlePressActivity = () => {
    if (activityName === "Walking") {
      setActivityName("Running");
    } else {
      setActivityName("Walking");
    }
  };

  // TODO:: formatTime()
  const formatTime = (aTime: number) => {
    let formattedTime = "";
    formattedTime = "" + aTime;

    return formattedTime;
  };

  return (
    <View className="flex flex-col h-full w-full justify-center">
      <View className='flex flex-row w-full h-full'>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          region={{
            latitude: location ? location.coords.latitude : DEFAULT_LATITUDE,
            longitude: location ? location.coords.longitude : DEFAULT_LONGITUDE,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={showUserLocation}
          followsUserLocation={followUserLocation}
        >
          {routeCoordinates.length > 1 && (
              <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#228B22"
                  strokeWidth={3}
              />
          )}
          {/* {location && (
              <Marker
                coordinate={{ 
                  latitude: location ? location.coords.latitude : DEFAULT_LATITUDE, 
                  longitude: location ? location.coords.longitude : DEFAULT_LONGITUDE 
                }}
                title="Current Location"
              />
          )} */}
        </MapView>
      </View>
      <View className='flex flex-row w-full h-40 justify-center'>
        <Button 
          className='flex w-1/3 bg-gray-300'
          onPress={handlePressActivity}>
            {activityName}
        </Button>
        <Button 
          className='flex w-1/3 bg-gray-300' 
          icon={recording ? "square" : "circle"}
          onPress={handlePressRecord}>
          {recording ? "Stop" : "Record"}
        </Button>
        <Text
          className='flex w-1/3 bg-gray-300'>
            {formatTime(time)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});