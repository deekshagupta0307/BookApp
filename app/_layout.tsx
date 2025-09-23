// import { Ionicons } from "@expo/vector-icons";
// import { Stack, Tabs, useRouter } from "expo-router";
// import { useEffect, useState } from "react";

// export default function RootLayout() {
//   // For now, hardcode isLoggedIn
//   const [isLoggedIn, setIsLoggedIn] = useState(true); // change to true/false to test
//   const router = useRouter();

//   useEffect(() => {
//     // Optional: redirect automatically if logged in
//     if (!isLoggedIn) {
//       router.replace("/(auth)/signup");
//     }
//   }, [isLoggedIn]);

//   if (!isLoggedIn) {
//     // Show signup stack first
//     return (
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="(auth)/signup" />
//       </Stack>
//     );
//   }

//   // If logged in, show bottom tabs
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: "#1E90FF",
//         tabBarInactiveTintColor: "gray",
//         tabBarStyle: { height: 70, paddingBottom: 10 },
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           tabBarLabel: "Home",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           tabBarLabel: "Explore",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="compass-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           tabBarLabel: "Profile",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";
export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // test login state
  const [mounted, setMounted] = useState(false); // track mounting
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // mark mounted
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.replace("/(auth)/signup"); // ✅ remove parentheses
    }
  }, [mounted, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/signup" /> {/* ✅ remove parentheses */}
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
