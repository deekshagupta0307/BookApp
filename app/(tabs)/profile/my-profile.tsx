import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function MyProfile() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="w-full h-24 bg-[#722F37] flex-row items-center justify-between px-5 mt-16">
        <Text className="text-white text-2xl font-bold">My Profile</Text>
      </View>

      <View className="flex-row px-5 py-6 items-center">
        <Image
          source={require("../../../assets/images/profile/user.png")}
          className="w-16 h-16 rounded-full"
          resizeMode="contain"
        />

        <View className="ml-4">
          <Text className="text-lg font-semibold">deeksha@123</Text>
          <Text className="text-gray-500 mt-1">123456</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between px-5 mt-2">
        <View className="w-[48%] border border-[#EFDFBB] rounded-xl py-5 mb-4 items-center">
          <Text className="text-lg text-gray-700 mb-2 font-semibold">
            Finished
          </Text>
          <Text className="text-md">1 Book(s)</Text>
        </View>

        <View className="w-[48%] border border-[#EFDFBB] rounded-xl py-5 mb-4 items-center">
          <Text className="text-lg text-gray-700 mb-2 font-semibold">
            Total Read
          </Text>
          <Text className="text-md">1K Page(s)</Text>
        </View>

        <View className="w-[48%] border border-[#EFDFBB] rounded-xl py-5 mb-4 items-center">
          <Text className="text-lg text-gray-700 mb-2 font-semibold">
            Badges
          </Text>
          <Text className="text-md">12</Text>
        </View>

        <View className="w-[48%] border border-[#EFDFBB] rounded-xl py-5 mb-4 items-center">
          <Text className="text-lg text-gray-700 mb-2 font-semibold">
            Days Streak
          </Text>
          <Text className="text-md">50</Text>
        </View>
      </View>

      <View className="px-5 mt-4">
        <TouchableOpacity
          className="flex-row justify-between items-center py-4"
          onPress={() => router.push("/my-shelf")}
        >
          <View className="flex-row items-center mb-4">
            <Image
              source={require("../../../assets/images/profile/book.png")}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-lg font-semibold">My Shelf</Text>
          </View>

          <ChevronRight size={20} color="#000" />
        </TouchableOpacity>

        <View className="w-full h-[1px] bg-gray-200" />

        {/* Privacy Policy */}
        <TouchableOpacity
          className="flex-row justify-between items-center py-4"
          onPress={() => router.push("/profile/privacy-policy")}
        >
          <View className="flex-row items-center mt-4">
            <Image
              source={require("../../../assets/images/profile/secure.png")}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-lg font-semibold">Privacy Policy</Text>
          </View>

          <ChevronRight size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="px-5 mt-6 mb-10">
        <TouchableOpacity
          className="bg-[#722F37] py-4 rounded-xl mb-4"
          onPress={() => router.push("/profile/settings")}
        >
          <Text className="text-white text-center font-semibold text-base">
            Profile Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-[#722F37] py-4 rounded-xl"
          onPress={() => console.log("Logout")}
        >
          <Text className="text-[#722F37] text-center font-semibold text-base">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
