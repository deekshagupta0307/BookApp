import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

type MenuRoute =
  | "/profile/favourites"
  | "/profile/achievements"
  | "/profile/settings"
  | "/profile/privacy-policy"
  | null;

const menuItems: { id: string; title: string; navigateTo: MenuRoute }[] = [
  { id: "1", title: "Favourites", navigateTo: "/profile/favourites" },
  { id: "2", title: "Achievements", navigateTo: "/profile/achievements" },
  { id: "3", title: "Settings", navigateTo: "/profile/settings" },
  { id: "4", title: "Privacy Policy", navigateTo: "/profile/privacy-policy" },
  { id: "5", title: "Logout", navigateTo: null },
];

export default function MyProfile() {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleMenuPress = (item: (typeof menuItems)[0]) => {
    if (item.navigateTo) {
      router.push(item.navigateTo);
    } else {
      setLogoutModalVisible(true);
    }
  };

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    console.log("User logged out");
    // Add actual logout logic here
  };

  return (
    <>
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

        {/* White Card */}
        <View
          style={{
            width: width * 0.8,
            backgroundColor: "#fff",
            alignSelf: "center",
            marginTop: -50,
            borderRadius: 20,
            padding: 16,
          }}
        >
          {/* Top Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <View style={{ alignItems: "flex-start" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginRight: 6 }}>20</Text>
                <Image
                  source={require("../../../assets/images/profile/icon1.png")}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ color: "#B5B6C4", marginTop: 4 }}>Books read</Text>
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
              <Text style={{ color: "#B5B6C4", marginTop: 4 }}>Pages read</Text>
            </View>
          </View>

          {/* Bottom Row */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "flex-start" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginRight: 6 }}>
                  Pages read
                </Text>
                <Image
                  source={require("../../../assets/images/profile/icon3.png")}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ color: "#B5B6C4", marginTop: 4 }}>Badges</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginRight: 6 }}>50</Text>
                <Image
                  source={require("../../../assets/images/profile/icon4.png")}
                  style={{ width: 14, height: 14 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ color: "#B5B6C4", marginTop: 4 }}>
                Days Streak
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ marginTop: 30, paddingHorizontal: 40 }}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 16,
              }}
              onPress={() => handleMenuPress(item)}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#141414" }}
              >
                {item.title}
              </Text>
              <Image
                source={require("../../../assets/images/home/arrow-right.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <Modal transparent animationType="fade" visible={logoutModalVisible}>
        <View style={{ flex: 1 }}>
          {/* Fullscreen Blur */}
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          {/* Centered Modal Box */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                width: width * 0.8,
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}
              >
                Are you sure?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {/* Yes Button */}
                <Pressable
                  style={{
                    flex: 1,
                    padding: 12,
                    backgroundColor: "#722F37",
                    borderRadius: 10,
                    marginRight: 8,
                  }}
                  onPress={handleConfirmLogout}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>

                {/* No Button */}
                <Pressable
                  style={{
                    flex: 1,
                    padding: 12,
                    backgroundColor: "#ccc",
                    borderRadius: 10,
                  }}
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={{ textAlign: "center", fontWeight: "600" }}>
                    No
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
