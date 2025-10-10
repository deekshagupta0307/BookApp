import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStore } from "../store/user-store";

export default function SignIn() {
  const router = useRouter();
  const signIn = useUserStore((s) => s.signIn);
  const isLoading = useUserStore((s) => s.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_GOOGLE_CLIENT_ID",
  });

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

  const handleAppleSignIn = async () => {
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) return;
      await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      router.replace("/components/hello-page");
    } catch (e) {}
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
      router.replace("/components/hello-page");
    } catch (e) {}
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
        <Text className="text-[#722F37] font-semibold text-sm">
          Forgot Password?
        </Text>
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
        >
          <Image
            source={require("../../assets/images/signup/google.png")}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
          />
          <Text className="text-gray-800 font-semibold">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full h-12 border border-gray-300 rounded-lg flex-row items-center justify-center bg-white px-4"
          onPress={handleAppleSignIn}
        >
          <Image
            source={require("../../assets/images/signup/apple.png")}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
          />
          <Text className="text-gray-800 font-semibold">
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-full py-4 items-center border-gray-200 mt-14">
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
