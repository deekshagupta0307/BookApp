import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProgressBar from "./progress-bar";

export default function EverydayPages() {
  const [pages, setPages] = useState("");
  const router = useRouter();

  const increment = () => {
    let num = parseInt(pages) || 0;
    if (num < 99) num += 1;
    setPages(num.toString());
  };

  const decrement = () => {
    let num = parseInt(pages) || 0;
    if (num > 0) num -= 1;
    setPages(num.toString());
  };

  const handleChange = (text: string) => {
    let num = text.replace(/[^0-9]/g, "");
    if (num.length > 2) num = num.slice(0, 2);
    setPages(num);
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
            padding: 24,
          }}
          style={{ backgroundColor: "#FFFBF2" }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top content */}
          <View className="items-center">
            {/* Full progress since this is the last page */}
            <ProgressBar step={4} totalSteps={4} />

            <Image
              source={require("../../assets/images/signup/monkey2.png")}
              className="w-72 h-72 mb-8 mt-6"
              resizeMode="contain"
            />

            <Text
              className="text-4xl font-semibold text-[#722F37] mb-6 text-center"
              style={{ lineHeight: 42 }}
            >
              How many pages you can read Everyday
            </Text>

            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={decrement}
                className="w-14 h-14 rounded-md items-center justify-center mr-4"
                style={{ backgroundColor: "#722F37" }}
              >
                <Text className="text-2xl text-white font-bold">-</Text>
              </TouchableOpacity>

              <TextInput
                value={pages}
                onChangeText={handleChange}
                keyboardType="numeric"
                placeholder="Pages Everyday"
                placeholderTextColor="#999"
                className="border border-gray-300 p-5 w-44 text-center rounded-lg bg-white"
              />

              <TouchableOpacity
                onPress={increment}
                className="w-14 h-14 rounded-md items-center justify-center ml-4"
                style={{ backgroundColor: "#722F37" }}
              >
                <Text className="text-2xl text-white font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Navigation Arrows */}
          <View className="flex-row justify-between w-full mb-10 px-4">
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
                onPress={() => router.push("/components/success-signup")}
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
