import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import ProgressBar from "./progress-bar";

export default function Signup1() {
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#FFFBF2]">
      {/* Progress bar at the top */}
      <ProgressBar step={1} totalSteps={4} />

      <View className="flex-1 justify-center items-center px-0">
        {/* Image */}
        <Image
          source={require("../../assets/images/signup/monkey1.png")}
          className="w-72 h-72 mb-8"
          resizeMode="contain"
        />

        {/* Heading */}
        <Text
          className="text-4xl font-semibold text-[#722F37] mb-6 text-center"
          style={{ lineHeight: 42 }}
        >
          Which book are you reading?
        </Text>

        {/* Input */}
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder="Enter the book name"
          className="border border-gray-300 p-5 w-full rounded-lg bg-white mb-6"
        />
      </View>

      {/* Bottom arrows */}
      <View className="flex-row justify-between w-full mb-10">
        {/* Previous */}
        <View
          className="w-20 h-20 rounded-full border-2 items-center justify-center"
          style={{ borderColor: "#EFDFBB" }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signin")}
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{ backgroundColor: "#EFDFBB" }}
          >
            <Text className="text-2xl text-[#722F37] font-extrabold">←</Text>
          </TouchableOpacity>
        </View>

        {/* Next */}
        <View
          className="w-20 h-20 rounded-full border-2 items-center justify-center"
          style={{ borderColor: "#722F37" }}
        >
          <TouchableOpacity
            onPress={() => router.push("./2")}
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{ backgroundColor: "#722F37" }}
          >
            <Text className="text-2xl text-white font-extrabold">→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
