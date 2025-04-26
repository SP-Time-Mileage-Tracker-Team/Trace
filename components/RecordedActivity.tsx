import React from "react";
import { Text, View } from "react-native";

const RecordedActivity = ({activity_name, route_coordinates, start_time, end_time}) => {

  return (
    <View className="flex flex-row w-full">
      <Text>{activity_name}</Text>
    </View>
  );
};

export default RecordedActivity;
