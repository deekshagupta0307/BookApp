import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import ProgressBar from "./progress-bar";

export default function Signup4() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#FFFBF2] p-6">
      <ProgressBar step={4} totalSteps={4} />

      <View className="flex-1 items-center justify-center">
        <Image
          source={require("../../assets/images/signup/monkey2.png")}
          className="w-72 h-72 mb-8"
          resizeMode="contain"
        />

        <Text
          className="text-4xl font-semibold text-[#722F37] mb-6 text-center"
          style={{ lineHeight: 42 }}
        >
          Create a Reading Plan for yourself
        </Text>

        <View className="w-full gap-4">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/home")}
            className="w-full h-14 rounded-lg items-center justify-center"
            style={{ backgroundColor: "#722F37" }}
          >
            <Text className="text-lg text-white font-semibold">
              Everyday Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/home")}
            className="w-full h-14 rounded-lg items-center justify-center border"
            style={{ borderColor: "#722F37", backgroundColor: "transparent" }}
          >
            <Text className="text-lg text-[#722F37] font-semibold">
              Custom Weekly Plan
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center mb-10">
        <View
          className="w-20 h-20 rounded-full border-2 items-center justify-center"
          style={{ borderColor: "#EFDFBB" }}
        >
          <TouchableOpacity
            onPress={() => router.push("./3")}
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{ backgroundColor: "#EFDFBB" }}
          >
            <Text className="text-2xl text-[#722F37] font-extrabold">←</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
