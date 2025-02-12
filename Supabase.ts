import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://viwtpmnbmnledpxkzyzy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpd3RwbW5ibW5sZWRweGt6eXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTAzMTUsImV4cCI6MjA1NDk2NjMxNX0.0mOyp8H0OJCZanbCWjcu663S0mWHbiftogOHT-I4Rc8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})