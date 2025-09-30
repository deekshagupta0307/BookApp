import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router"; // ✅ Import useRouter

export default function Page2() {
  const router = useRouter(); // ✅ Initialize router

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Top Container */}
      <View className="flex-row items-center justify-between px-4 py-3 mt-12">
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

      {/* Monkey Image */}
      <View className="items-center mt-6">
        <Image
          source={require("../../../assets/images/signup/monkey1.png")}
          className="w-64 h-64"
          resizeMode="contain"
        />
      </View>

      {/* Heading */}
      <Text className="text-3xl font-semibold text-center mt-4 mb-6 text-[#722F37]">
        Create a Reading Plan for yourself
      </Text>

      {/* Buttons */}
      <View className="px-6 gap-4">
        <TouchableOpacity
          onPress={() => router.push("/book/page3")}
          className="w-full h-14 rounded-lg items-center justify-center"
          style={{ backgroundColor: "#722F37" }}
        >
          <Text className="text-lg text-white font-semibold">Everyday Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/book/page4")}
          className="w-full h-14 rounded-lg items-center justify-center border"
          style={{ borderColor: "#722F37", backgroundColor: "transparent" }}
        >
          <Text className="text-lg text-[#722F37] font-semibold">
            Custom Weekly Plan
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
