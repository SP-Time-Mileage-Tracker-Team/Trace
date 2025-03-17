import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-paper';
import TabBarIcon from '../components/TabBarIcon';
import * as Location from 'expo-location';

export default function RecordScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [timerText, setTimerText] = useState("");
  const startTimeRef = useRef(0);
  const [activityName, setActivityName] = useState("Walking");

  useEffect(() => {
    async function getCurrentLocation() {
      //let { status } = await Location.requestForegroundPermissionsAsync();
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();

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

  console.log(text);

  const handlePressRecord = () => {
    if (recording) {
      console.log("Stop recording");
      setRecording(false);
    } else {
      console.log("Start recording");
      setRecording(true);
      // TODO:: save activity
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
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* <Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
            title="Marker Title"
            description="Marker Description"
          /> */}
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