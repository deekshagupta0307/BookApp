import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookAdded() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFFFFF] justify-center items-center">
        <ActivityIndicator size={80} color="#722F37" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            justifyContent: "flex-start",
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center py-3">
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("../../../assets/images/book/arrow-left.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text className="text-xl font-semibold ml-3">Add a Book</Text>
          </View>

          {/* Monkey Image */}
          <View className="items-center mt-16 mb-6">
            <Image
              source={require("../../../assets/images/signup/monkey5.png")}
              className="w-64 h-64"
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <Text className="text-3xl font-semibold text-[#722F37] mb-4 text-center">
            Your Book Added!
          </Text>

          {/* Paragraph */}
          <Text className="text-lg font-medium mb-6 text-center">
            Your Book “The Great Gatsby” is successfully added.
          </Text>

          {/* Button */}
          <View className="mt-4">
            <TouchableOpacity
              onPress={() => {
                setButtonLoading(true);
                router.push("/my-shelf/reading-now");
                setButtonLoading(false);
              }}
              className="bg-[#722F37] py-4 rounded-lg items-center justify-center flex-row"
              disabled={buttonLoading} // prevent multiple taps
            >
              {buttonLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-lg">My Shelf</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
