import React from "react";
import { Text, View } from "react-native";

const RecordedActivityList = () => {

  return (
    <View className="flex flex-row w-full">
      <FlatList
            data={recordedActivities}
            renderItem={renderRecordedActivity}
            keyExtractor={item => item.id}
        />
    </View>
  );
};

export default RecordedActivityList;
