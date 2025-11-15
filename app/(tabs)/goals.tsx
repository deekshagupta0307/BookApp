import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Goals() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ marginTop: 20 }}>
          <Text className="text-2xl font-semibold text-[#722F37] mb-4">
            Goals
          </Text>
          <Text className="text-base text-gray-600">
            Your reading goals and achievements will appear here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

