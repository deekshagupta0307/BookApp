import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

/**
 * Tabs Route Group Layout
 * 
 * This layout defines the main tab navigation for authenticated users.
 * All routes within (tabs) are accessible via the bottom tab bar.
 * 
 * Tab Routes:
 * - home: Main home page (default tab)
 * - explore: Book discovery page
 * - profile: User profile page
 * 
 * Non-tab Routes (still accessible via navigation):
 * - currently-reading: Currently reading books page
 * - Book/*: Book addition flow pages
 * - my-pals/*: Reading pals pages
 * - my-shelf/*: User's reading shelf pages
 * - profile/*: Profile sub-pages (settings, achievements, etc.)
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 70, paddingBottom: 10 },
      }}
    >
      {/* Only these 3 tabs will appear in the bottom navigation */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      {/* Hidden from tab bar - nested routes wrapped in Stack layouts won't appear in tabs */}
      <Tabs.Screen
        name="currently-reading"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="Book"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="my-pals"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="my-shelf"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

