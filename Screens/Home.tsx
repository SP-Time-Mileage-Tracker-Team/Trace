import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Session } from '@supabase/supabase-js'
import { supabase } from '../Supabase'
import RecordedActivity from '../components/RecordedActivity';

export default function HomeScreen({ session }: { session: Session }) {
  const [recordedActivities, setRecordedActivities] = useState<any>(null);

  const renderRecordedActivity = ({ item }: { item:any }) => 
    <RecordedActivity 
      activity_name={item.activity_name}
      route_coordinates={item.route_coordinates}
      start_time={item.start_time}
      end_time={item.end_time}
    />;

  async function getRecordedActivities() {

    const { data, error } = await supabase
    .from('RecordedActivities')
    .select();
    // .select('name, orchestral_sections(*)')
    // .eq('orchestral_sections.name', 'percussion');

    console.log(data);
    setRecordedActivities(data);
    }

  useEffect(() => {

    
    getRecordedActivities();

  });

  return (
    <View style={styles.container}>
      {!recordedActivities ?
        <Text style={styles.title}>No Activities Recorded Yet!</Text>
      :
        // <RecordedActivityList data={recordedActivities} />
        <FlatList
            data={recordedActivities}
            renderItem={renderRecordedActivity}
            keyExtractor={item => item.id}
        />
      }
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});