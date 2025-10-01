import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProgressBar from "./progress-bar";
import { useSignupStore } from "../store/signup-store";
import { useState } from "react";

export default function Signup3() {
  const router = useRouter();
  const { totalPages, setTotalPages } = useSignupStore();
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleNext = () => {
    if (!totalPages.trim()) {
      setError("Please enter total pages");
      return;
    }
    setError("");
    router.push("./4");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFBF2" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            padding: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center">
            <ProgressBar step={3} totalSteps={4} />

            <Image
              source={require("../../assets/images/signup/monkey1.png")}
              className="w-72 h-72 mb-8 mt-6"
              resizeMode="contain"
            />

            <Text className="text-4xl font-semibold text-[#722F37] mb-6 text-center">
              How many pages does this book have?
            </Text>

            <TextInput
              value={totalPages}
              onChangeText={(text) => {
                setTotalPages(text);
                if (text.trim()) setError("");
              }}
              placeholder="Enter Number of Pages"
              keyboardType="numeric"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                borderWidth: 1,
                borderColor: isFocused ? "#722F37" : "#E7E7E7",
                padding: 20,
                width: "100%",
                borderRadius: 12,
                backgroundColor: "#fff",
                marginBottom: 6,
              }}
            />
            {error ? (
              <Text className="text-red-500 mb-6">{error}</Text>
            ) : (
              <View className="mb-6" />
            )}
          </View>

          <View className="flex-row justify-between w-full mb-10 px-4">
            <View
              className="w-20 h-20 rounded-full border-2 items-center justify-center"
              style={{ borderColor: "#EFDFBB" }}
            >
              <TouchableOpacity
                onPress={() => router.push("./2")}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: "#EFDFBB" }}
              >
                <Text className="text-2xl text-[#722F37] font-extrabold">
                  ←
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className="w-20 h-20 rounded-full border-2 items-center justify-center"
              style={{ borderColor: "#722F37" }}
            >
              <TouchableOpacity
                onPress={handleNext}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: "#722F37" }}
              >
                <Text className="text-2xl text-white font-extrabold">→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
