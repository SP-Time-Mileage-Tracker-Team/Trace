import React from "react";
import { Text, View } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const RecordedActivity = ({activity_name, route_coordinates, start_time, end_time}) => {

  return (
    <View className="flex flex-rows w-full h-300 border-2 border-green-500 rounded-lg p-4">
        <Text className="flex text-2xl font-bold text-[#228B22] text-center">
            {new Date(start_time).toLocaleString()}
        </Text>
        <Text className="w-full text-2xl font-bold text-[#228B22] text-center">Activity Name: {activity_name}</Text>
        <MapView
            provider={PROVIDER_GOOGLE}
            style={{flex: 1, width: 300, height: 100}}
            initialRegion={{
            latitude: (route_coordinates[0].latitude + route_coordinates.slice(-1)[0].latitude) / 2,
            longitude: (route_coordinates[0].longitude + route_coordinates.slice(-1)[0].longitude) / 2,
            latitudeDelta: Math.abs(route_coordinates[0].latitude - route_coordinates.slice(-1)[0].latitude) * 1.5,
            longitudeDelta: Math.abs(route_coordinates[0].longitude - route_coordinates.slice(-1)[0].longitude) * 1.5,
            }}

            // **Disable all user interaction:**
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            showsUserLocation={false}
            zoomControlEnabled={false}
        >
            <Polyline
            coordinates={route_coordinates}
            strokeColor="#00AAFF"   // line color
            strokeWidth={4}         // line thickness
            />
        </MapView>
    </View>
  );
};

export default RecordedActivity;
