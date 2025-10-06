import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FDF6E7", padding: 20 }}>
      {/* Back Arrow + Heading */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 24,
          marginTop: 48,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/profile/my-profile")}>
          <Image
            source={require("../../../assets/images/book/arrow-left.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 12 }}>
          Privacy Policy
        </Text>
      </View>

      {/* Paragraph below heading */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "400",
          lineHeight: 26,
          color: "#000000",
          textAlign: "center",
          marginBottom: 24,
          marginTop: 36,
        }}
      >
        Welcome to our Reading Tracker application. We are committed to protecting your privacy, and this Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this policy carefully. If you do not agree with the terms outlined here, we kindly request that you refrain from accessing or using the application.
      </Text>
    </ScrollView>
  );
}
