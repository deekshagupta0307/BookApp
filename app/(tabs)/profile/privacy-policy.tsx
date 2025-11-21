import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFFFFF", padding: 18 }}
    >
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

      {/* Bullet Points */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 14 }}>
          ● We are committed to protecting your privacy and safeguarding your personal information.
        </Text>

        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 14 }}>
          ● Information may be collected to improve the functionality, performance, and user experience of the Reading Tracker application.
        </Text>

        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 14 }}>
          ● We may collect data such as your profile details, reading logs, preferences, and device information.
        </Text>

        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 14 }}>
          ● Your information will not be sold, shared, or disclosed unless required by law or necessary for the functionality of the app.
        </Text>

        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 14 }}>
          ● We use reasonable security practices to protect your information against unauthorized access or misuse.
        </Text>

        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 14 }}>
          ● Continued use of the application indicates acceptance of the terms outlined in this Privacy Policy.
        </Text>

        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 14 }}>
          ● If you do not agree with any part of this policy, please discontinue using the application.
        </Text>
      </View>
    </ScrollView>
  );
}
