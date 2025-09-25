import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUserStore } from "../store/user-store"; 

export default function SuccessSignup() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const firstName = useUserStore((s) => s.firstName);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFFBF2] justify-center items-center">
        <ActivityIndicator size={80} color="#722F37" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFFBF2] justify-center items-center px-6">
      <Image
        source={require("../../assets/images/signup/monkey5.png")}
        className="w-72 h-72 mb-10"
        resizeMode="contain"
      />

      <Text
        className="text-4xl font-semibold text-[#722F37] mb-2 text-center"
        style={{ lineHeight: 42 }}
      >
        High five, {firstName || "Friend"}!
      </Text>

      <Text
        className="text-lg text-black text-center mb-14 font-semibold"
        style={{ lineHeight: 24 }}
      >
        You’ve successfully signed up. Let’s start your reading adventure!
      </Text>

      <View
        className="w-20 h-20 rounded-full border-2 items-center justify-center"
        style={{ borderColor: "#722F37" }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="w-14 h-14 rounded-full items-center justify-center"
          style={{ backgroundColor: "#722F37" }}
        >
          <Text className="text-2xl text-white font-extrabold">→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
