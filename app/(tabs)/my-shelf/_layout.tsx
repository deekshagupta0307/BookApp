import { Stack } from "expo-router";

/**
 * My Shelf Routes Layout
 * 
 * This layout wraps all shelf-related routes in a Stack navigator.
 * These routes are hidden from the tab bar and only accessible via navigation.
 * 
 * Routes:
 * - reading-now
 */
export default function MyShelfLayout() {
  return (
    <Stack
      initialRouteName="reading-now"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="reading-now" />
    </Stack>
  );
}

