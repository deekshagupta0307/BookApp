import { Stack } from "expo-router";

/**
 * Profile Routes Layout
 * 
 * This layout wraps all profile-related routes in a Stack navigator.
 * Only "my-profile" should be accessible via the tab bar, other routes are nested.
 * 
 * Routes:
 * - my-profile (default - accessible via profile tab)
 * - achievements, favourites, settings, privacy-policy (nested routes)
 */
export default function ProfileLayout() {
  return (
    <Stack
      initialRouteName="my-profile"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="my-profile" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="favourites" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}

