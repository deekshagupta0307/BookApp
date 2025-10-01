import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";

const { width } = Dimensions.get("window");

const horizontalUsers = [
  { id: "1", name: "Alice", text: "Loves reading fiction" },
  { id: "2", name: "Bob", text: "Enjoys fantasy novels" },
  { id: "3", name: "Charlie", text: "Sci-fi enthusiast" },
  { id: "4", name: "Diana", text: "Mystery lover" },
];

const verticalUsers = [
  { id: "1", name: "Eve", text: "Reading classics" },
  { id: "2", name: "Frank", text: "Into biographies" },
  { id: "3", name: "Grace", text: "Poetry reader" },
];

export default function PalsPage() {
  const [activeTab, setActiveTab] = useState<"Explore New Pals" | "My Pals">(
    "Explore New Pals"
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: "#722F37", padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: "600" }}>
              My Pals
            </Text>
            <View
              style={{
                backgroundColor: "#FDF6E7",
                padding: 6,
                borderRadius: 4,
              }}
            >
              <Image
                source={require("../../../assets/images/home/menu.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 8,
              marginTop: 16,
              overflow: "hidden",
            }}
          >
            {["Explore New Pals", "My Pals"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() =>
                    setActiveTab(tab as "Explore New Pals" | "My Pals")
                  }
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isActive ? "#EFDFBB" : "#fff",
                    height: isActive ? 36 : 40,
                    borderRadius: 6,
                    marginTop: 4,
                    marginLeft: isActive ? 4 : 2,
                    marginRight: isActive ? 4 : 2,
                  }}
                >
                  <Text
                    style={{
                      color: "#141414",
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FAFAFA",
              height: 48,
              borderRadius: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: "#E7E7E7",
            }}
          >
            <Image
              source={require("../../../assets/images/shelf/search.png")}
              style={{ width: 20, height: 20, marginRight: 8 }}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Explore Pals"
              placeholderTextColor="#141414"
              style={{ flex: 1, fontSize: 14, color: "#141414" }}
            />
          </View>
        </View>

        <View style={{ marginTop: 20, paddingLeft: 16, paddingRight: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#141414",
                flex: 1, 
              }}
              numberOfLines={1}
            >
              Suggested Pals
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#722F37",
                textDecorationLine: "underline",
                marginLeft: 8,
              }}
            >
              Add Contacts
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {horizontalUsers.map((user) => (
              <View
                key={user.id}
                style={{
                  width: 140,
                  borderWidth: 1,
                  borderColor: "#EFDFBB",
                  borderRadius: 12,
                  marginRight: 12,
                  padding: 12,
                  backgroundColor: "#fff",
                }}
              >
                <TouchableOpacity
                  style={{ position: "absolute", top: 8, right: 8 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#722F37",
                    }}
                  >
                    ×
                  </Text>
                </TouchableOpacity>
                <Image
                  source={require("../../../assets/images/pals/user.png")}
                  style={{
                    width: 50,
                    height: 50,
                    alignSelf: "center",
                    marginBottom: 8,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{ fontWeight: "600", fontSize: 16, marginBottom: 4 }}
                >
                  Kunal
                </Text>
                <Text style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>
                  {user.text}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#722F37",
                    paddingVertical: 6,
                    borderRadius: 6,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#141414",
              marginBottom: 12,
            }}
          >
            Recommended Pals
          </Text>
          {verticalUsers.map((user) => (
            <View
              key={user.id}
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "#EFDFBB",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <Image
                source={require("../../../assets/images/pals/user.png")}
                style={{ width: 50, height: 50, marginRight: 12 }}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", fontSize: 16 }}>Kunal</Text>
                <Text style={{ fontSize: 12, color: "#555" }}>{user.text}</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#722F37",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
