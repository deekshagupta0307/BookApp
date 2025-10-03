import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const initialBooksData = [
  { id: "1", title: "Harry Potter and the Philosopher's Stone", text: "By J. K. Rowling", progress: 0.7 },
  { id: "2", title: "Harry Potter and the Chamber of Secrets", text: "By J. K. Rowling", progress: 0.4 },
  { id: "3", title: "Harry Potter and the Prisoner of Azkaban", text: "By J. K. Rowling", progress: 0.9 },
  { id: "4", title: "Harry Potter and the Goblet of Fire", text: "By J. K. Rowling", progress: 0.2 },
  { id: "5", title: "Harry Potter and the Order of the Phoenix", text: "By J. K. Rowling", progress: 0.5 },
];

export default function PalProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reading" | "finished">("reading");
  const [booksData, setBooksData] = useState(initialBooksData);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const horizontalCards = [
    { id: "1", title: "Read Today", subtitle: "25 Book(s)" },
    { id: "2", title: "Currently Reading", subtitle: "10 Book(s)" },
    { id: "3", title: "Finished Reading", subtitle: "5 Book(s)" },
  ];

  const handleAddPal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRequestSent(true);
    }, 1500); // simulate API call
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>

        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 36 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../../assets/images/book/arrow-left.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 12 }}>kunals1408</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity>
            <Image
              source={require("../../../assets/images/shelf/menu2.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}>
          <Image
            source={require("../../../assets/images/pals/user.png")}
            style={{ width: 60, height: 60, borderRadius: 37.5, marginRight: 16 }}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Kunal Saini</Text>
            <Text style={{ fontSize: 16, color: "#A1A1A1", marginTop: 4 }}>@kunals1408</Text>
          </View>
        </View>

        {/* Horizontal Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          style={{ marginTop: 20 }}
        >
          {horizontalCards.map((card, index) => (
            <View
              key={card.id}
              style={{
                width: 140,
                height: 75,
                borderWidth: 1,
                borderColor: "#EFDFBB",
                borderRadius: 10,
                backgroundColor: "transparent",
                marginRight: index === horizontalCards.length - 1 ? 0 : 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 15, textAlign: "center" }} numberOfLines={1} ellipsizeMode="tail">
                {card.title}
              </Text>
              <Text style={{ fontSize: 16, color: "#141414", marginTop: 6, fontWeight: "400", textAlign: "center" }}>
                {card.subtitle}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Add Pal Button */}
        <TouchableOpacity
          onPress={handleAddPal}
          disabled={requestSent}
          style={{
            marginHorizontal: 16,
            marginTop: 36,
            marginBottom: 8,
            paddingVertical: 14,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#722F37",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: requestSent ? "transparent" : "#722F37",
            flexDirection: "row",
          }}
        >
          {loading ? (
            <ActivityIndicator color={requestSent ? "#722F37" : "#fff"} />
          ) : (
            <Text style={{ color: requestSent ? "#722F37" : "#FFFFFF", fontWeight: "600" }}>
              {requestSent ? "Request Sent" : "Add Pal"}
            </Text>
          )}
        </TouchableOpacity>

        {/* HR Line */}
        <View style={{ height: 1, backgroundColor: "#E0E0E0", marginHorizontal: 16, marginBottom: 16, marginTop: 24 }} />

        {/* Lock Section */}
        <View style={{ alignItems: "center", paddingHorizontal: 16, marginTop: 16 }}>
          <Image
            source={require("../../../assets/images/pals/lock.png")}
            style={{ width: 30, height: 30, marginBottom: 16 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Profile Locked</Text>
          <Text style={{ fontSize: 14, color: "#A1A1A1", textAlign: "center" }}>
            Become Kunal’s Pal to see his book details
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
