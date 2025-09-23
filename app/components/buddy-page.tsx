import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function BuddyPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#FFFBF2] p-6">

      <View className="flex-1 items-center justify-center">
        <Image
          source={require("../../assets/images/signup/monkey4.png")}
          className="w-72 h-72 mb-8"
          resizeMode="contain"
        />

        <Text
          className="text-4xl font-semibold text-[#722F37] mb-2 text-center"
          style={{ lineHeight: 42 }}
        >
          I’m your reading buddy
        </Text>

        <Text
          className="text-lg text-black text-center mb-6 font-semibold"
          style={{ lineHeight: 24 }}
        >
          I’ll Help you to personalize your reading experience
        </Text>
      </View>

      <View className="items-center mb-10">
        <View
          className="w-20 h-20 rounded-full border-2 items-center justify-center"
          style={{ borderColor: "#722F37" }}
        >
          <TouchableOpacity
            onPress={() => router.push("./1")}
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
