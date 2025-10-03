import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const menuItems = [
  { id: "1", title: "Edit Profile", navigateTo: "/edit-profile" },
  { id: "2", title: "Settings", navigateTo: "/settings" },
  { id: "3", title: "My Books", navigateTo: "/my-books" },
  { id: "4", title: "Notifications", navigateTo: "/notifications" },
];

export default function MyProfile() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FDF6E7" }}>
      {/* Top Background Section */}
      <View style={{ width: "100%", height: 300, position: "relative" }}>
        <Image
          source={require("../../../assets/images/profile/bg.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        {/* Centered Icon */}
        <Image
          source={require("../../../assets/images/profile/icon.png")}
          style={{
            width: 80,
            height: 80,
            position: "absolute",
            top: 120,
            left: width / 2 - 40,
            borderRadius: 40,
          }}
          resizeMode="contain"
        />

        {/* Name below Icon */}
        <Text
          style={{
            position: "absolute",
            top: 210,
            width: "100%",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "600",
            color: "#FFFFFF",
          }}
        >
          Kunal Saini
        </Text>
      </View>

      {/* Narrow White Card overlapping bg */}
      <View
        style={{
          width: width * 0.9, // narrower
          backgroundColor: "#fff",
          alignSelf: "center",
          marginTop: -50, // overlap
          borderRadius: 20,
          padding: 16,
        }}
      >

        {/* Top Row */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 40 }}>
          <View style={{ alignItems: "flex-start" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "600", marginRight: 6 }}>20</Text>
              <Image
                source={require("../../../assets/images/profile/icon1.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ color: "#A1A1A1", marginTop: 4 }}>Books read</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "600", marginRight: 6 }}>1000</Text>
              <Image
                source={require("../../../assets/images/profile/icon2.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ color: "#A1A1A1", marginTop: 4 }}>Pages read</Text>
          </View>
        </View>

        {/* Bottom Row */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ alignItems: "flex-start" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "600", marginRight: 6 }}>Pages read</Text>
              <Image
                source={require("../../../assets/images/profile/icon3.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ color: "#A1A1A1", marginTop: 4 }}>Badges</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "600", marginRight: 6 }}>50</Text>
              <Image
                source={require("../../../assets/images/profile/icon4.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ color: "#A1A1A1", marginTop: 4 }}>Days Streak</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={{ marginTop: 30, paddingHorizontal: 16 }}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#EFDFBB",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#141414" }}>
              {item.title}
            </Text>
            <Image
              source={require("../../../assets/images/home/arrow-right.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
