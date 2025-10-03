import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router"; 

const contactsData = [
  { id: "1", name: "Kunal Saini", text: "@kunals1408", type: "add" },
  { id: "2", name: "Kunal Saini", text: "@kunals1408", type: "invite" },
  { id: "3", name: "Kunal Saini", text: "@kunals1408", type: "add" },
  { id: "4", name: "Kunal Saini", text: "@kunals1408", type: "invite" },
];

export default function AddContactsPage() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 50,
            paddingBottom: 16,
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Back Arrow */}
          <TouchableOpacity onPress={() => router.push("/my-pals/pals-page")}>
            <Image
              source={require("../../../assets/images/book/arrow-left.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Heading left-aligned next to arrow */}
          <Text
            style={{
              color: "#141414",
              fontSize: 20,
              fontWeight: "600",
              marginLeft: 12, 
            }}
          >
            Add Contacts
          </Text>

          {/* Menu Icon aligned right */}
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity>
              <Image
                source={require("../../../assets/images/shelf/menu2.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
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
              placeholder="Search Contacts"
              placeholderTextColor="#141414"
              style={{ flex: 1, fontSize: 14, color: "#141414" }}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* My Contacts Heading */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            marginTop: 20,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            My Contacts: 100
          </Text>
        </View>

        {/* Contacts List */}
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          {contactsData.map((contact) => (
            <View
              key={contact.id}
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
                style={{ width: 50, height: 50, marginRight: 16 }}
                resizeMode="contain"
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  {contact.name}
                </Text>
                <Text style={{ fontSize: 14, color: "#A1A1A1" }}>
                  {contact.text}
                </Text>
              </View>

              {/* Add / Invite Button on right side */}
              <TouchableOpacity
                onPress={() => router.push("/my-pals/add-pal")}
                style={{
                  backgroundColor: "#722F37",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {contact.type === "add" ? "Add" : "Invite"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
