import { Stack } from "expo-router";

/**
 * Book Routes Layout
 * 
 * This layout wraps all book-related routes in a Stack navigator.
 * These routes are hidden from the tab bar and only accessible via navigation.
 * 
 * Routes:
 * - page1, page2, page3, page4 (book addition flow)
 * - book-added (success page)
 */
export default function BookLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="page1" />
      <Stack.Screen name="page2" />
      <Stack.Screen name="page3" />
      <Stack.Screen name="page4" />
      <Stack.Screen name="book-added" />
    </Stack>
  );
}

