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

export default function SignUp() {
  const router = useRouter();
  const signUp = useUserStore((s) => s.signUp);
  const isLoading = useUserStore((s) => s.isLoading);

  const [firstName, setFirstNameLocal] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleSignUp = async () => {
    setErrors({ firstName: "", lastName: "", email: "", password: "" });
    let valid = true;
    const newErrors = { firstName: "", lastName: "", email: "", password: "" };

    // Validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }
    if (!password.trim() || !validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    // Attempt to sign up
    const result = await signUp(email, password, firstName, lastName);

    if (result.success) {
      // Alert.alert(
      //   "Success!",
      //   "Account created successfully. Please check your email to verify your account.",
      //   [
      //     {
      //       text: "OK",
      //       onPress: () => router.replace("/(auth)/signin"),
      //     },
      //   ]
      // );
      router.replace("/(tabs)/Book/page1");
    } else {
      Alert.alert(
        "Error",
        result.error || "Failed to create account. Please try again."
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#FFFBF2] px-6"
      contentContainerStyle={{ alignItems: "center", paddingVertical: 10 }}
    >
      {/* <View className="w-full flex-row justify-end mb-4 mt-16">
        <TouchableOpacity onPress={() => router.replace("/home")}>
          <Text className="text-[#722F37] font-semibold text-base">Skip</Text>
        </TouchableOpacity>
      </View>
      <View className="w-full flex-row justify-end mb-4">
        <TouchableOpacity
          onPress={() => router.replace("/my-shelf/reading-now")}
        >
          <Text className="text-[#722F37] font-semibold text-base">
            My shelf
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-full flex-row justify-end mb-4">
        <TouchableOpacity onPress={() => router.replace("/my-pals/pals-page")}>
          <Text className="text-[#722F37] font-semibold text-base">
            My Pals
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-full flex-row justify-end mb-4">
        <TouchableOpacity onPress={() => router.replace("/profile/my-profile")}>
          <Text className="text-[#722F37] font-semibold text-base">
            Profile
          </Text>
        </TouchableOpacity>
      </View> */}
      <Image
        source={require("../../assets/images/signup/logo.png")}
        className="w-40 h-40"
        resizeMode="contain"
      />

      <Text className="text-[19px] font-medium text-center text-black mb-6">
        Sign Up & Start Your Reading Journey
      </Text>

      {/* First & Last Name */}
      <View className="flex-row w-full mb-2">
        <View className="flex-1 mr-2">
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstNameLocal}
            className="h-12 border border-gray-300 rounded-lg px-3 bg-white"
          />
          {errors.firstName ? (
            <Text className="text-red-600 text-sm mt-1">
              {errors.firstName}
            </Text>
          ) : null}
        </View>
        <View className="flex-1 ml-2">
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            className="h-12 border border-gray-300 rounded-lg px-3 bg-white"
          />
          {errors.lastName ? (
            <Text className="text-red-600 text-sm mt-1">{errors.lastName}</Text>
          ) : null}
        </View>
      </View>

      {/* Email */}
      <TextInput
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-1"
      />
      {errors.email ? (
        <Text className="text-red-600 text-sm mb-2">{errors.email}</Text>
      ) : null}

      {/* Password */}
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
        onPress={handleSignUp}
        className="w-full h-12 rounded-lg items-center justify-center mb-6"
        style={{ backgroundColor: "#722F37" }}
        disabled={isLoading}
      >
        {isLoading ? (
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

      {/* OR Divider */}
      <View className="flex-row items-center w-full mb-10">
        <View className="flex-1 h-px bg-[#67747A]" />
        <Text className="mx-2 font-semibold text-[#67747A]">OR</Text>
        <View className="flex-1 h-px bg-[#67747A]" />
      </View>

      {/* Social Buttons */}
      <View className="flex-col w-full mb-14 gap-4">
        <TouchableOpacity className="w-full h-12 border border-gray-300 rounded-lg flex-row items-center justify-center bg-white px-4">
          <Image
            source={require("../../assets/images/signup/google.png")}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
          />
          <Text className="text-gray-800 font-semibold">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full h-12 border border-gray-300 rounded-lg flex-row items-center justify-center bg-white px-4">
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

      {/* Terms & Privacy */}
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
