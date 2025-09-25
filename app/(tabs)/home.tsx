import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../store/user-store";

export default function Home() {
  const firstName = useUserStore((s) => s.firstName);

  return (
    <SafeAreaView className="flex-1 bg-[#FDF6E7]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center px-6 mt-4">
          <Image
            source={require("../../assets/images/home/logo.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/images/home/profile.png")}
            className="w-12 h-12 rounded-full"
            resizeMode="contain"
          />
        </View>

        <View className="px-6 mt-6">
          <Text className="text-2xl font-bold text-[#722F37]">
            Hello, {firstName || "Friend"}
          </Text>
          <Text className="text-base text-gray-700 mt-2">
            Have you been reading lately?
          </Text>
        </View>

        <View className="bg-white rounded-2xl shadow-md mx-6 mt-8 p-6">
          <Text className="text-xl font-semibold text-[#722F37] text-center">
            Book Name
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            Author Name
          </Text>

          <View className="mt-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-600">Progress</Text>
              <Text className="text-sm text-gray-600">60%</Text>
            </View>
            <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <View className="h-3 bg-[#722F37] w-[60%]" />
            </View>
          </View>

          <View className="mt-6 space-y-2">
            <Text className="text-base text-gray-700">• Read 20 pages today</Text>
            <Text className="text-base text-gray-700">• Complete weekly goal</Text>
          </View>

          <View className="mt-10">
            <Text className="text-xl font-semibold text-[#722F37] mb-4">
              Weekly Plan
            </Text>

            <View className="flex-row justify-between">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => (
                  <View key={day} className="items-center">
                    <TouchableOpacity className="w-12 h-12 bg-[#EFDFBB] rounded-full justify-center items-center mb-2">
                      <Text className="text-sm font-semibold text-[#722F37]">
                        {day}
                      </Text>
                    </TouchableOpacity>
                    <View className="w-12 h-12 bg-[#722F37] rounded-full justify-center items-center">
                      <Text className="text-xs text-white">{index + 20}</Text>
                    </View>
                  </View>
                )
              )}
            </View>
          </View>

          <View className="mt-10">
            <Text className="text-base text-gray-700 text-center mb-4">
              Stay consistent to achieve your reading goals!
            </Text>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity className="flex-1 bg-[#EFDFBB] py-3 rounded-xl mr-3">
                <Text className="text-center text-[#722F37] font-semibold">Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#722F37] py-3 rounded-xl ml-3">
                <Text className="text-center text-white font-semibold">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
