import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-white p-4 pt-14 pb-10"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.push("/profile/my-profile")}>
          <Image
            source={require("../../../assets/images/book/arrow-left.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text className="text-[22px] font-semibold ml-3">
          Edit Profile Settings
        </Text>
      </View>

      <View className="items-center mb-6">
        <Image
          source={require("../../../assets/images/profile/user.png")}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />

        <TouchableOpacity>
          <Text className="text-[#722F37] underline mt-2 font-semibold">
            Edit Profile Picture
          </Text>
        </TouchableOpacity>
      </View>

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-3 flex-row items-center">
        <TextInput placeholder="Username" className="flex-1" />
      </View>
      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-3 flex-row items-center">
        <TextInput placeholder="Full Name" className="flex-1" />
      </View>

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-4 flex-row items-center">
        <TextInput
          placeholder="Email Address"
          className="flex-1"
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity
        className="bg-[#722F37] py-4 rounded-xl mb-8"
        onPress={() => console.log("Save Changes")}
      >
        <Text className="text-white text-center font-semibold text-base">
          Save Changes
        </Text>
      </TouchableOpacity>

      <Text className="text-lg font-semibold mb-4">Reset Password</Text>

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-3 flex-row items-center">
        <TextInput
          placeholder="Current Password"
          secureTextEntry
          className="flex-1"
        />
      </View>

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-3 flex-row items-center">
        <TextInput
          placeholder="Enter New Password"
          secureTextEntry
          className="flex-1"
        />
      </View>

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-8 flex-row items-center">
        <TextInput
          placeholder="Re-enter New Password"
          secureTextEntry
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
}
