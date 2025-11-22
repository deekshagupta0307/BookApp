import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStore } from "../store/user-store";

// Complete the OAuth session when browser closes
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const signIn = useUserStore((s) => s.signIn);
  const signInWithGoogle = useUserStore((s) => s.signInWithGoogle);
  const signInWithApple = useUserStore((s) => s.signInWithApple);
  const forgotPassword = useUserStore((s) => s.forgotPassword);
  const isLoading = useUserStore((s) => s.isLoading);
  const initializeAuth = useUserStore((s) => s.initializeAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSignIn = async () => {
    setErrors({ email: "", password: "" });
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Validation
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    // Attempt to sign in
    const result = await signIn(email, password);

    if (result.success) {
      router.replace("/(tabs)/home");
    } else {
      Alert.alert(
        "Error",
        result.error || "Failed to sign in. Please check your credentials."
      );
    }
  };

  // Handle OAuth callback from deep link
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      if (url.includes('auth/callback')) {
        // Wait a bit for Supabase to process the session
        setTimeout(async () => {
          await initializeAuth();
          const user = useUserStore.getState().user;
          if (user) {
            router.replace("/(tabs)/home");
          }
        }, 1000);
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, [router, initializeAuth]);

  const handleAppleSignIn = async () => {
    try {
      setIsOAuthLoading(true);
      
      // Try native Apple Sign In first (iOS only)
      if (Platform.OS === 'ios') {
        const available = await AppleAuthentication.isAvailableAsync();
        if (available) {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            if (credential.identityToken) {
              // For native flow, we'd need to exchange the token
              // For now, fall back to OAuth URL flow
              const result = await signInWithApple();
              if (result.success && result.url) {
                const browserResult = await WebBrowser.openAuthSessionAsync(
                  result.url,
                  `${process.env.EXPO_PUBLIC_APP_SCHEME || 'bookapp'}://auth/callback`
                );
                
                if (browserResult.type === 'success') {
                  await initializeAuth();
                  const user = useUserStore.getState().user;
                  if (user) {
                    router.replace("/(tabs)/home");
                  }
                }
              } else if (result.error) {
                Alert.alert("Error", result.error);
              }
            }
          } catch (error: any) {
            if (error.code !== 'ERR_REQUEST_CANCELED') {
              // User cancelled, try OAuth URL flow as fallback
              const result = await signInWithApple();
              if (result.success && result.url) {
                const browserResult = await WebBrowser.openAuthSessionAsync(
                  result.url,
                  `${process.env.EXPO_PUBLIC_APP_SCHEME || 'bookapp'}://auth/callback`
                );
                
                if (browserResult.type === 'success') {
                  await initializeAuth();
                  const user = useUserStore.getState().user;
                  if (user) {
                    router.replace("/(tabs)/home");
                  }
                }
              } else if (result.error) {
                Alert.alert("Error", result.error);
              }
            }
          }
        } else {
          // Apple Sign In not available, use OAuth URL
          const result = await signInWithApple();
          if (result.success && result.url) {
            const browserResult = await WebBrowser.openAuthSessionAsync(
              result.url,
              `${process.env.EXPO_PUBLIC_APP_SCHEME || 'bookapp'}://auth/callback`
            );
            
            if (browserResult.type === 'success') {
              await initializeAuth();
              const user = useUserStore.getState().user;
              if (user) {
                router.replace("/(tabs)/home");
              }
            }
          } else if (result.error) {
            Alert.alert("Error", result.error);
          }
        }
      } else {
        // Android or other platforms - use OAuth URL
        const result = await signInWithApple();
        if (result.success && result.url) {
          const browserResult = await WebBrowser.openAuthSessionAsync(
            result.url,
            `${process.env.EXPO_PUBLIC_APP_SCHEME || 'bookapp'}://auth/callback`
          );
          
          if (browserResult.type === 'success') {
            await initializeAuth();
            const user = useUserStore.getState().user;
            if (user) {
              router.replace("/(tabs)/home");
            }
          }
        } else if (result.error) {
          Alert.alert("Error", result.error);
        }
      }
    } catch (error: any) {
      console.error("Apple Sign In Error:", error);
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert("Error", "Failed to sign in with Apple. Please try again.");
      }
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsOAuthLoading(true);
      const result = await signInWithGoogle();
      
      if (result.success && result.url) {
        const browserResult = await WebBrowser.openAuthSessionAsync(
          result.url,
          `${process.env.EXPO_PUBLIC_APP_SCHEME || 'bookapp'}://auth/callback`
        );
        
        if (browserResult.type === 'success') {
          await initializeAuth();
          const user = useUserStore.getState().user;
          if (user) {
            router.replace("/(tabs)/home");
          }
        } else if (browserResult.type === 'cancel') {
          // User cancelled, do nothing
        }
      } else if (result.error) {
        Alert.alert("Error", result.error);
      }
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert("Error", "Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address to reset your password."
      );
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      Alert.alert(
        "Password Reset Email Sent",
        "Please check your email for instructions to reset your password."
      );
    } else {
      Alert.alert(
        "Error",
        result.error || "Failed to send password reset email. Please try again."
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#FFFBF2] px-6"
      contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
    >
      <Image
        source={require("../../assets/images/signup/logo.png")}
        className="w-40 h-40"
        resizeMode="contain"
      />

      <Text className="text-2xl font-medium text-center text-black mb-6">
        Hi Pal! Glad To See You
      </Text>

      <TextInput
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-2"
      />
      {errors.email ? (
        <Text className="text-red-600 text-sm mb-2">{errors.email}</Text>
      ) : null}

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-1"
      />
      {errors.password ? (
        <Text className="text-red-600 text-sm mb-2">{errors.password}</Text>
      ) : null}

      <View className="w-full mb-6 items-end">
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className="text-[#722F37] font-semibold text-sm">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSignIn}
        className="w-full h-12 bg-[#722F37] rounded-lg items-center justify-center mb-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>

      <Text className="text-center text-black mb-12">
        Don't have an account?{" "}
        <Text
          className="text-[#722F37] font-semibold"
          onPress={() => router.push("/(auth)/signup")}
        >
          Create one now
        </Text>
      </Text>

      <View className="flex-row items-center w-full mb-10">
        <View className="flex-1 h-px bg-[#67747A]" />
        <Text className="mx-2 font-semibold text-[#67747A]">OR</Text>
        <View className="flex-1 h-px bg-[#67747A]" />
      </View>

      <View className="flex-col w-full mb-14 gap-4">
        <TouchableOpacity
          className="w-full h-12 border border-gray-300 rounded-lg flex-row items-center justify-center bg-white px-4"
          onPress={handleGoogleSignIn}
          disabled={isOAuthLoading || isLoading}
        >
          {isOAuthLoading ? (
            <ActivityIndicator size="small" color="#722F37" />
          ) : (
            <>
              <Image
                source={require("../../assets/images/signup/google.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Text className="text-gray-800 font-semibold">
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full h-12 border border-gray-300 rounded-lg flex-row items-center justify-center bg-white px-4"
          onPress={handleAppleSignIn}
          disabled={isOAuthLoading || isLoading}
        >
          {isOAuthLoading ? (
            <ActivityIndicator size="small" color="#722F37" />
          ) : (
            <>
              <Image
                source={require("../../assets/images/signup/apple.png")}
                className="w-6 h-6 mr-2"
                resizeMode="contain"
              />
              <Text className="text-gray-800 font-semibold">
                Continue with Apple
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View className="w-full py-4 items-center border-gray-200 mt-16">
        <Text className="text-center text-black text-sm px-3 font-semibold">
          By continuing, you agree to our{" "}
          <Text
            className="text-[#722F37] underline"
            onPress={() => Linking.openURL("https://example.com/terms")}
          >
            Terms
          </Text>{" "}
          &{" "}
          <Text
            className="text-[#722F37] underline"
            onPress={() => Linking.openURL("https://example.com/privacy")}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </ScrollView>
  );
}
