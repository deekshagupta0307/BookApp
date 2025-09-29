import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";
export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [mounted, setMounted] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // mark mounted
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.replace("/(auth)/signup"); 
    }
  }, [mounted, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/signup" />
      </Stack>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 70, paddingBottom: 10 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
