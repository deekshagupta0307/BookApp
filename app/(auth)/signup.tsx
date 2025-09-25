import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useUserStore } from "../store/user-store";

export default function SignUp() {
  const router = useRouter();
  const setFirstName = useUserStore((s) => s.setFirstName);
  const setCredentials = useUserStore((s) => s.setCredentials);

  const [firstName, setFirstNameLocal] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSignUp = () => {
    if (!firstName.trim()) return Alert.alert("Error", "First name is required.");
    if (!email.trim() || !validateEmail(email))
      return Alert.alert("Error", "Please enter a valid email address.");
    if (!password.trim()) return Alert.alert("Error", "Password is required.");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFirstName(firstName);
      setCredentials(email, password);
      Alert.alert("Success", "Signed Up Successfully!");
      router.replace("/(auth)/signin");
    }, 2000);
  };

  return (
    <ScrollView
      className="flex-1 bg-[#FFFBF2] px-6"
      contentContainerStyle={{ alignItems: "center", paddingVertical: 10 }}
    >
      <Image
        source={require("../../assets/images/signup/logo.png")}
        className="w-40 h-40"
        resizeMode="contain"
      />

      <Text className="text-2xl font-medium text-center text-black mb-6">
        Sign Up & Start Your Reading Journey
      </Text>

      <View className="flex-row w-full mb-4">
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstNameLocal}
          className="flex-1 h-12 border border-gray-300 rounded-lg px-3 bg-white mr-2"
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          className="flex-1 h-12 border border-gray-300 rounded-lg px-3 bg-white ml-2"
        />
      </View>

      <TextInput
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-4"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-2"
      />

      <View className="w-full mb-6 items-end">
        <Text className="text-[#722F37] font-semibold text-sm">
          Forgot Password?
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSignUp}
        className="w-full h-12 rounded-lg items-center justify-center mb-6"
        style={{ backgroundColor: "#722F37" }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text className="text-center text-black mb-10">
        Already have an account?{" "}
        <Text
          className="text-[#722F37] font-semibold"
          onPress={() => router.push("/(auth)/signin")}
        >
          Sign In
        </Text>
      </Text>

      <View className="flex-row items-center w-full mb-10">
        <View className="flex-1 h-px bg-[#67747A]" />
        <Text className="mx-2 font-semibold text-[#67747A]">OR</Text>
        <View className="flex-1 h-px bg-[#67747A]" />
      </View>

      <View className="flex-col w-full mb-14 gap-4">
        <TouchableOpacity className="w-full h-12 border border-gray-300 rounded-lg flex-row items-center justify-center bg-white px-4">
          <Image
            source={require("../../assets/images/signup/google.png")}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
          />
          <Text className="text-gray-800 font-semibold">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full h-12 border border-gray-300 rounded-lg flex-row items-center justify-center bg-white px-4">
          <Image
            source={require("../../assets/images/signup/apple.png")}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
          />
          <Text className="text-gray-800 font-semibold">Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <View className="w-full py-4 items-center border-gray-200 mb-8">
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
