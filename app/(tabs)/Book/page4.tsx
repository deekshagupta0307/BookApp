import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSignupStore } from "@/app/store/signup-store";

export default function Page4() {
  const router = useRouter();
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyPages = useSignupStore((s) => s.weeklyPages);
  const setWeeklyPages = useSignupStore((s) => s.setWeeklyPages);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const increment = (day: string) => {
    let num = parseInt(weeklyPages[day]) || 0;
    if (num < 99) num += 1;
    setWeeklyPages(day, num.toString());
    setError("");
  };

  const decrement = (day: string) => {
    let num = parseInt(weeklyPages[day]) || 0;
    if (num > 0) num -= 1;
    setWeeklyPages(day, num.toString());
    setError("");
  };

  const handleChange = (day: string, text: string) => {
    let num = text.replace(/[^0-9]/g, "");
    if (num.length > 2) num = num.slice(0, 2);
    setWeeklyPages(day, num);
    setError("");
  };

  const handleSubmit = () => {
    const hasAnyValue = Object.values(weeklyPages).some((v) => v && parseInt(v) > 0);
    if (!hasAnyValue) {
      setError("Please enter at least one day’s reading plan.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/book/book-added");
    }, 1000);
  };

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
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require("../../../assets/images/book/arrow-left.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text className="text-xl font-semibold ml-3">Add a Book</Text>
            </View>
          </View>

          <Text className="text-3xl font-semibold text-[#722F37] mb-6 text-center mt-6">
            Custom Weekly Schedule
          </Text>

          <View className="flex-col gap-4">
            {weekdays.map((day) => (
              <View key={day} className="flex-row items-center justify-between">
                <View
                  className="w-28 h-12 rounded-lg items-center justify-center"
                  style={{ backgroundColor: "#FDF6E7" }}
                >
                  <Text className="text-[#722F37] font-semibold">{day}</Text>
                </View>

                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => decrement(day)}
                    className="w-10 h-10 rounded-md items-center justify-center mr-2"
                    style={{ backgroundColor: "#722F37" }}
                  >
                    <Text className="text-xl text-white font-bold">-</Text>
                  </TouchableOpacity>

                  <TextInput
                    value={weeklyPages[day] || ""}
                    onChangeText={(text) => handleChange(day, text)}
                    keyboardType="numeric"
                    placeholder="00"
                    placeholderTextColor="#999"
                    className="p-3 w-28 text-center rounded-lg bg-white"
                    style={{
                      borderWidth: 1,
                      borderColor: focusedField === day ? "#722F37" : "#D1D5DB",
                    }}
                    onFocus={() => setFocusedField(day)}
                    onBlur={() => setFocusedField(null)}
                  />

                  <TouchableOpacity
                    onPress={() => increment(day)}
                    className="w-10 h-10 rounded-md items-center justify-center ml-2"
                    style={{ backgroundColor: "#722F37" }}
                  >
                    <Text className="text-xl text-white font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {error && (
            <Text className="text-red-500 text-sm mt-4 text-center">{error}</Text>
          )}

          <View className="flex-row justify-between mt-10 mb-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 mr-2 py-4 rounded-lg items-center justify-center border border-[#722F37]"
              style={{ backgroundColor: "transparent" }}
            >
              <Text className="text-[#722F37] font-semibold text-lg">Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 ml-2 py-4 rounded-lg items-center justify-center"
              style={{ backgroundColor: "#722F37" }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-lg">Add Book</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
