import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useUserStore } from "./store/user-store";

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const updatePassword = useUserStore((s) => s.updatePassword);
  const isLoading = useUserStore((s) => s.isLoading);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Establish Supabase session from deep link tokens (if provided)
  useEffect(() => {
    const handleSession = async () => {
      try {
        // Supabase recovery links include access_token and refresh_token
        const accessToken =
          (params.access_token as string) || (params.accessToken as string);
        const refreshToken =
          (params.refresh_token as string) || (params.refreshToken as string);

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            Alert.alert("Error", "Check your link - it may have expired.");
          }
        }
      } catch (e) {
        Alert.alert("Error", "Failed to set session from link.");
      }
    };

    handleSession();
  }, [params]);

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleResetPassword = async () => {
    setErrors({ newPassword: "", confirmPassword: "" });
    let valid = true;
    const newErrors = { newPassword: "", confirmPassword: "" };

    // Validation
    if (!newPassword.trim() || !validatePassword(newPassword)) {
      newErrors.newPassword = "Password must be at least 6 characters";
      valid = false;
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    // Attempt to update password
    const result = await updatePassword(newPassword);

    if (result.success) {
      Alert.alert("Success", "Your password has been updated successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(auth)/signin"),
        },
      ]);
    } else {
      Alert.alert(
        "Error",
        result.error || "Failed to update password. Please try again."
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#FFFBF2] px-6"
      contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
    >
      <Image
        source={require("../assets/images/signup/logo.png")}
        className="w-40 h-40"
        resizeMode="contain"
      />

      <Text className="text-2xl font-medium text-center text-black mb-6">
        Reset Your Password
      </Text>

      <Text className="text-center text-gray-600 mb-8 px-4">
        Enter your new password below
      </Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-2"
      />
      {errors.newPassword ? (
        <Text className="text-red-600 text-sm mb-2">{errors.newPassword}</Text>
      ) : null}

      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-1"
      />
      {errors.confirmPassword ? (
        <Text className="text-red-600 text-sm mb-2">
          {errors.confirmPassword}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={handleResetPassword}
        className="w-full h-12 bg-[#722F37] rounded-lg items-center justify-center mb-6 mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">
            Update Password
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/(auth)/signin")}
        className="w-full h-12 border border-[#722F37] rounded-lg items-center justify-center"
      >
        <Text className="text-[#722F37] text-base font-semibold">
          Back to Sign In
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
