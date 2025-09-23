import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const router = useRouter();

  const handleSignUp = () => {
    Alert.alert("Success", "Signed Up Successfully!");
    router.replace("/components/hello-page");
  };

  return (
    <View className="flex-1 bg-[#FFFBF2]">
      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 10,
        }}
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
          className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-4"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white mb-2"
        />

        {/* Forgot Password */}
        <View className="w-full mb-6 items-end">
          <Text
            className="text-[#722F37] font-semibold text-sm"
          >
            Forgot Password?
          </Text>
        </View>

        {/* Sign In button */}
        <TouchableOpacity
          onPress={handleSignUp}
          className="w-full h-12 bg-[#722F37] rounded-lg items-center justify-center mb-6"
        >
          <Text className="text-white text-base font-semibold">Sign In</Text>
        </TouchableOpacity>

        {/* Create account */}
        <Text className="text-center text-black mb-12">
          Don't have an account?{" "}
          <Text
            className="text-[#722F37] font-semibold"
            onPress={() => router.push("/(auth)/signup")}
          >
            Create one now
          </Text>
        </Text>

        {/* OR line */}
        <View className="flex-row items-center w-full mb-10">
          <View className="flex-1 h-px bg-[#67747A] font-semibold" />
          <Text className="mx-2 font-semibold text-[#67747A]">OR</Text>
          <View className="flex-1 h-px bg-[#67747A] font-semibold" />
        </View>

        {/* Social buttons */}
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
      </ScrollView>

      {/* Bottom Terms & Privacy */}
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
    </View>
  );
}
