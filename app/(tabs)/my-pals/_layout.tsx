import { Stack } from "expo-router";

/**
 * My Pals Routes Layout
 * 
 * This layout wraps all pals-related routes in a Stack navigator.
 * These routes are hidden from the tab bar and only accessible via navigation.
 * 
 * Routes:
 * - pals-page, add-pal, add-contacts, pal-profile
 */
export default function MyPalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="pals-page" />
      <Stack.Screen name="add-pal" />
      <Stack.Screen name="add-contacts" />
      <Stack.Screen name="pal-profile" />
    </Stack>
  );
}

