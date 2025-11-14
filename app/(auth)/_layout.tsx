import { Stack } from "expo-router";

/**
 * Authentication Route Group Layout
 * 
 * This layout wraps all authentication-related routes (signin, signup).
 * Uses a Stack navigator to allow navigation between auth screens.
 * 
 * Routes in this group:
 * - /(auth)/signup
 * - /(auth)/signin
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="signup" />
      <Stack.Screen name="signin" />
    </Stack>
  );
}

