import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const achievementsList = [
  { id: "1", title: "NO.1 Reader", description: "Read total of 100 books", progress: "12/20" },
  { id: "2", title: "Habit", description: "Read 10 days in a row", progress: "5/5" },
  { id: "3", title: "Best Pal", description: "Add 20 Pals", progress: "7/15" },
  { id: "4", title: "Minute Master", description: "Read total of 1000 minutes", progress: "20/20" },
];

export default function Achievements() {
  const router = useRouter();

  const getDiamondIcon = (progress: string) => {
    const [score, total] = progress.split("/").map(Number);
    return score === total
      ? require("../../../assets/images/profile/diamond-filled.png")
      : require("../../../assets/images/profile/diamond.png");
  };

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
          Achievements
        </Text>
      </View>

      {/* List Items */}
      {achievementsList.map((item, index) => (
        <View
          key={item.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderBottomWidth: index !== achievementsList.length - 1 ? 1 : 0,
            borderBottomColor: "#D9D9D9",
          }}
        >
          <View style={{ maxWidth: width * 0.65 }}>
            <Text style={{ fontWeight: "600", fontSize: 18, marginTop: 16 }}>
              {item.title}
            </Text>
            <Text style={{ color: "#000000", marginTop: 4, marginBottom: 12, fontSize: 14 }}>
              {item.description}
            </Text>
          </View>

          <View style={{ width: 40, alignItems: "center" }}>
            <Image
              source={getDiamondIcon(item.progress)}
              style={{ width: 24, height: 24, marginTop: 16 }}
              resizeMode="contain"
            />
            <Text
              style={{
                marginTop: 4,
                color: "#000000",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              {item.progress}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
