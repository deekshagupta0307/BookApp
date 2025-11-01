import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";

/**
 * Root Layout
 * 
 * This is the main layout file for the entire app.
 * It handles:
 * - Overall app structure
 * - Authentication state management
 * - Initial routing based on login status
 * 
 * Route Groups:
 * - (auth): Authentication routes (signin, signup) - handled by app/(auth)/_layout.tsx
 * - (tabs): Main app routes with tab navigation - handled by app/(tabs)/_layout.tsx
 */
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth routes - managed by (auth)/_layout.tsx */}
      <Stack.Screen name="(auth)" />
      
      {/* Tab routes - managed by (tabs)/_layout.tsx */}
      <Stack.Screen name="(tabs)" />
      
      {/* Other routes */}
      <Stack.Screen name="components" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
