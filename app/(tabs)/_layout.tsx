import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#DAB49D', // latte tan
        headerStyle: {
          backgroundColor: '#4B3621', // dark roast brown
        },
        headerShadowVisible: false,
        headerTintColor: '#DAB49D', // latte tan
        tabBarStyle: {
          backgroundColor: '#4B3621', // dark roast brown
        },
        tabBarInactiveTintColor: '#F5F5DC', // light cream
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home-sharp' : 'home-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? 'information-circle'
                  : 'information-circle-outline'
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
