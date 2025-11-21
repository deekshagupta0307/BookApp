import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Tabs Route Group Layout
 * 
 * This layout defines the main tab navigation for authenticated users.
 * All routes within (tabs) are accessible via the bottom tab bar.
 * 
 * Tab Routes:
 * - home: Main home page (default tab)
 * - my-pals: Reading pals page
 * - my-shelf: User's reading shelf page
 * - goals: Reading goals page
 * - profile: User profile page
 * 
 * Non-tab Routes (still accessible via navigation):
 * - currently-reading: Currently reading books page
 * - Book/*: Book addition flow pages
 * - explore: Book discovery page (hidden from tabs)
 * - profile/*: Profile sub-pages (settings, achievements, etc.)
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#722F37",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          height: 70 + (Platform.OS === 'android' ? Math.max(insets.bottom - 10, 0) : 0),
          paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 10) : 10,
          paddingTop: 5,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          backgroundColor: "#FFFFFF",
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <Ionicons name="home" color={color} size={24} />
            </View>
          ),
        }}
      />
      {/* Pals Tab */}
      <Tabs.Screen
        name="my-pals"
        options={{
          title: "Pals",
          tabBarLabel: "Pals",
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <Ionicons name="people" color={color} size={24} />
            </View>
          ),
        }}
      />
      {/* My Shelf Tab */}
      <Tabs.Screen
        name="my-shelf"
        options={{
          title: "My Shelf",
          tabBarLabel: "My Shelf",
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <Ionicons name="library" color={color} size={24} />
            </View>
          ),
        }}
      />
      {/* Goals Tab */}
      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          tabBarLabel: "Goals",
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <Ionicons name="flag" color={color} size={24} />
            </View>
          ),
        }}
      />
      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <Ionicons name="person" color={color} size={24} />
            </View>
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
        name="book"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: -8,
    width: 30,
    height: 3,
    backgroundColor: "#722F37",
    borderRadius: 2,
  },
});

