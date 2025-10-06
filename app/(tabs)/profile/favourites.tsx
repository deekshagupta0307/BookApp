import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const favouritesList = [
  { id: "1", title: "Book Name", description: "Author Name" },
  { id: "2", title: "Book Name", description: "Author Name" },
  { id: "3", title: "Book Name", description: "Author Name" },
  { id: "4", title: "Book Name", description: "Author Name" },
  { id: "5", title: "Book Name", description: "Author Name" },
];

export default function Favourites() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FDF6E7", padding: 20 }}>
      {/* Back Arrow + Heading */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 28,
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
          Favourites
        </Text>
      </View>

      {/* List Items */}
      {favouritesList.map((item, index) => (
        <View
          key={item.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderBottomWidth: index !== favouritesList.length - 1 ? 1 : 0,
            borderBottomColor: "#D9D9D9",
          }}
        >
          <View style={{ maxWidth: width * 0.65 }}>
            <Text style={{ fontWeight: "600", fontSize: 18, marginTop: 12 }}>
              {item.title}
            </Text>
            <Text style={{ color: "#000000", marginTop: 4, marginBottom: 12, fontSize: 14 }}>
              {item.description}
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../../assets/images/profile/heart.png")}
              style={{ width: 24, height: 24, marginTop: 12 }}
              resizeMode="contain"
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
