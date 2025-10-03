import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const horizontalUsers = [
  { id: "1", name: "Kunal Saini", text: "@kunals1408" },
  { id: "2", name: "Kunal Saini", text: "@kunals1408" },
  { id: "3", name: "Kunal Saini", text: "@kunals1408" },
  { id: "4", name: "Kunal Saini", text: "@kunals1408" },
];

const verticalUsers = [
  { id: "1", name: "Kunal Saini", text: "@kunals1408" },
  { id: "2", name: "Kunal Saini", text: "@kunals1408" },
  { id: "3", name: "Kunal Saini", text: "@kunals1408" },
];

const palsData = [
  { id: "1", name1: "Kunal Saini", name2: "@kunals1408" },
  { id: "2", name1: "Kunal Saini", name2: "@kunals1408" },
  { id: "3", name1: "Kunal Saini", name2: "@kunals1408" },
  { id: "4", name1: "Kunal Saini", name2: "@kunals1408" },
];

export default function PalsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Explore New Pals" | "My Pals">(
    "Explore New Pals"
  );
  const [editMode, setEditMode] = useState(false);
  const [selectedPals, setSelectedPals] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedPals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteConfirm = () => {
    setDeleting(true);
    setTimeout(() => {
      palsData.splice(0, 0);
      setSelectedPals([]);
      setEditMode(false);
      setDeleting(false);
      setShowDialog(false);
    }, 500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
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

          {/* Tabs */}
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
                  onPress={() => {
                    setActiveTab(tab as "Explore New Pals" | "My Pals");
                    setEditMode(false);
                    setSelectedPals([]);
                  }}
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

        {/* Search */}
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
              placeholder={
                activeTab === "Explore New Pals"
                  ? "Explore Pals"
                  : "Search Pals"
              }
              placeholderTextColor="#141414"
              style={{ flex: 1, fontSize: 14, color: "#141414" }}
            />
          </View>
        </View>

        {/* Content */}
        {activeTab === "Explore New Pals" ? (
          <>
            {/* Suggested Pals */}
            <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
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
                  }}
                  numberOfLines={1}
                >
                  Suggested Pals
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/my-pals/add-contacts")}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#722F37",
                      textDecorationLine: "underline",
                    }}
                  >
                    Add Contacts
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {horizontalUsers.map((user) => (
                  <View
                    key={user.id}
                    style={{
                      width: 160,
                      height: 200,
                      borderWidth: 1,
                      borderColor: "#EFDFBB",
                      borderRadius: 12,
                      marginRight: 12,
                      padding: 12,
                      backgroundColor: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <Text
                        style={{
                          fontSize: 28,
                          fontWeight: "500",
                          color: "black",
                        }}
                      >
                        ×
                      </Text>
                    </TouchableOpacity>

                    <Image
                      source={require("../../../assets/images/pals/user.png")}
                      style={{ width: 75, height: 75, marginBottom: 8 }}
                      resizeMode="contain"
                    />

                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 16,
                        marginBottom: 4,
                        textAlign: "center",
                      }}
                    >
                      {user.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#A1A1A1",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      {user.text}
                    </Text>

                    <TouchableOpacity
                      onPress={() => router.push("/my-pals/add-pal")}
                      style={{
                        backgroundColor: "#722F37",
                        paddingVertical: 12,
                        paddingHorizontal: 50,
                        borderRadius: 6,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Recommended Pals */}
            <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#141414",
                  marginBottom: 12,
                }}
              >
                Pals You May Know
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
                    style={{ width: 50, height: 50, marginRight: 16 }}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "600", fontSize: 16 }}>
                      {user.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#A1A1A1" }}>
                      {user.text}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push("/my-pals/add-pal")}
                    style={{
                      backgroundColor: "#722F37",
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      borderRadius: 6,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* My Pals */}
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
              <Text style={{ fontSize: 16 }}>
                <Text style={{ fontWeight: "600" }}>
                  {editMode ? "Remove Pals" : "My Pals"}
                </Text>
                {!editMode && `: ${palsData.length}`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditMode(!editMode);
                  setSelectedPals([]);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#722F37",
                    textDecorationLine: "underline",
                  }}
                >
                  {editMode ? "Close" : "Edit Pal List"}
                </Text>
              </TouchableOpacity>
            </View>

            {palsData.map((pal) => (
              <View
                key={pal.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 16,
                  marginBottom: 12,
                }}
              >
                {/* Entire card clickable */}
                <TouchableOpacity
                  onPress={() => router.push("/my-pals/pal-profile")}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#EFDFBB",
                    borderRadius: 12,
                    padding: 12,
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
                      {pal.name1}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#A1A1A1" }}>
                      {pal.name2}
                    </Text>
                  </View>

                  {/* Arrow inside card */}
                  <Image
                    source={require("../../../assets/images/home/arrow-right.png")}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {/* Checkbox outside the card */}
                {editMode && (
                  <TouchableOpacity
                    onPress={() => toggleSelection(pal.id)}
                    style={{ marginLeft: 12 }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderWidth: 2,
                        borderColor: "#722F37",
                        borderRadius: 4,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: selectedPals.includes(pal.id)
                          ? "#722F37"
                          : "#fff",
                      }}
                    >
                      {selectedPals.includes(pal.id) && (
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Delete button */}
      {editMode && selectedPals.length > 0 && (
        <View style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <TouchableOpacity
            onPress={() => setShowDialog(true)}
            style={{
              backgroundColor: "#722F37",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                Remove Pals
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <Modal visible={showDialog} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <View
            style={{
              width: width - 40,
              backgroundColor: "#FFFBF2",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#141414",
                marginBottom: 8,
              }}
            >
              Remove Pals?
            </Text>
            <Text style={{ fontSize: 14, color: "#141414", marginBottom: 20 }}>
              Are you sure, you want to remove your {selectedPals.length} pal(s)?
              You can add them again.
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={handleDeleteConfirm}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: "#722F37",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 5,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Remove
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowDialog(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#722F37",
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 5,
                }}
              >
                <Text style={{ color: "#722F37", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
