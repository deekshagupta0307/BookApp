import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProgressBar from "./progress-bar";
import { useSignupStore } from "../store/signup-store";

export default function WeeklyPages() {
  const router = useRouter();
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyPages = useSignupStore((s) => s.weeklyPages);
  const setWeeklyPages = useSignupStore((s) => s.setWeeklyPages);
  const [error, setError] = useState("");
  const [focusedDay, setFocusedDay] = useState<string | null>(null);

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
    const hasAnyValue = Object.values(weeklyPages).some(
      (v) => v && parseInt(v) > 0
    );
    if (!hasAnyValue) {
      setError("Please enter at least one day’s reading plan.");
      return;
    }
    setError("");
    router.push("/components/success-signup");
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
            padding: 24,
            justifyContent: "space-between",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar step={4} totalSteps={4} />

          <Text className="text-4xl font-semibold text-[#722F37] mb-6 text-center">
            Custom Weekly Schedule
          </Text>

          <View className="flex-col gap-4">
            {weekdays.map((day) => (
              <View key={day} className="flex-row items-center justify-between">
                <View
                  className="w-28 h-12 rounded-md items-center justify-center"
                  style={{ backgroundColor: "#EFDFBB" }}
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
                    onFocus={() => setFocusedDay(day)}
                    onBlur={() => setFocusedDay(null)}
                    style={{
                      borderWidth: 1,
                      borderColor: focusedDay === day ? "#722F37" : "#E7E7E7",
                      padding: 10,
                      width: 70,
                      textAlign: "center",
                      borderRadius: 10,
                      backgroundColor: "#fff",
                    }}
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

          {error ? (
            <Text className="text-red-500 text-sm mt-4 text-center">
              {error}
            </Text>
          ) : null}

          <View className="flex-row justify-between w-full mt-10 px-4 mb-10">
            <View
              className="w-20 h-20 rounded-full border-2 items-center justify-center"
              style={{ borderColor: "#EFDFBB" }}
            >
              <TouchableOpacity
                onPress={() => router.push("./4")}
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
                onPress={handleSubmit}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: "#722F37" }}
              >
                <Text className="text-2xl text-white font-extrabold">✔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
