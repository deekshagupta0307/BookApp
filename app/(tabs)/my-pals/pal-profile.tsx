import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const initialBooksData = [
  {
    id: "1",
    title: "Harry Potter and the Philosopher's Stone",
    text: "By J. K. Rowling",
    progress: 0.7,
  },
  {
    id: "2",
    title: "Harry Potter and the Chamber of Secrets",
    text: "By J. K. Rowling",
    progress: 0.4,
  },
  {
    id: "3",
    title: "Harry Potter and the Prisoner of Azkaban",
    text: "By J. K. Rowling",
    progress: 0.9,
  },
  {
    id: "4",
    title: "Harry Potter and the Goblet of Fire",
    text: "By J. K. Rowling",
    progress: 0.2,
  },
  {
    id: "5",
    title: "Harry Potter and the Order of the Phoenix",
    text: "By J. K. Rowling",
    progress: 0.5,
  },
];

export default function PalProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reading" | "finished">("reading");
  const [booksData, setBooksData] = useState(initialBooksData);
  const [editMode, setEditMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const toggleSelectBook = (id: string) => {
    setSelectedBooks((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  const handleDeleteConfirm = () => {
    setDeleting(true);
    setTimeout(() => {
      setBooksData(
        booksData.filter((book) => !selectedBooks.includes(book.id))
      );
      setSelectedBooks([]);
      setEditMode(false);
      setDeleting(false);
      setShowDialog(false);
    }, 500);
  };

  // Horizontal cards data
  const horizontalCards = [
    { id: "1", title: "Read Today", subtitle: "25 Book(s)" },
    { id: "2", title: "Currently Reading", subtitle: "10 Book(s)" },
    { id: "3", title: "Finished Reading", subtitle: "5 Book(s)" },
  ];

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
            backgroundColor: "#fff",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../../assets/images/book/arrow-left.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 12 }}>
            kunals1408
          </Text>
          <View style={{ flex: 1 }} /> {/* Spacer */}
          <TouchableOpacity>
            <Image
              source={require("../../../assets/images/shelf/menu2.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            marginTop: 16,
          }}
        >
          <Image
            source={require("../../../assets/images/pals/user.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 37.5,
              marginRight: 16,
            }}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Kunal Saini</Text>
            <Text style={{ fontSize: 16, color: "#A1A1A1", marginTop: 4 }}>
              @kunals1408
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: 16,
            paddingRight: 16, // container padding
          }}
          style={{ marginTop: 20 }}
        >
          {horizontalCards.map((card, index) => {
            return (
              <View
                key={card.id}
                style={{
                  width: 140, // fixed width for all cards
                  height: 75,
                  borderWidth: 1,
                  borderColor: "#EFDFBB",
                  borderRadius: 10,
                  backgroundColor: "transparent",
                  marginRight: index === horizontalCards.length - 1 ? 0 : 12, // spacing between cards
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 15,
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {card.title}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#141414",
                    marginTop: 6,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                >
                  {card.subtitle}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Transparent Button */}
        <TouchableOpacity
          style={{
            marginHorizontal: 16,
            marginTop: 20,
            marginBottom: 32,
            paddingVertical: 14,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#722F37",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ color: "#722F37", fontWeight: "600" }}>
            Remove Pal
          </Text>
        </TouchableOpacity>

        {/* Horizontal Toggle Section - Segmented Control Style */}
        <View
          style={{
            width: "100%", // full width
            height: 90, // taller section
            backgroundColor: "#722F37",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 16,
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: "#fff",
              height: 40,
            }}
          >
            {["reading", "finished"].map((tab, index) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => {
                    setActiveTab(tab as "reading" | "finished");
                    setEditMode(false);
                    setSelectedBooks([]);
                  }}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isActive ? "#EFDFBB" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      color: "#141414",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Books List */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          {booksData.map((book) => (
            <View
              key={book.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => router.push("/currently-reading")}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: "#EFDFBB",
                  borderRadius: 12,
                  padding: 12,
                  backgroundColor: "#fff",
                  opacity: editMode ? 0.8 : 1,
                  minHeight: 120,
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../assets/images/home/book.png")}
                  style={{ width: 50, height: 50, marginRight: 12 }}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", fontSize: 16 }}>
                    {book.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#A1A1A1",
                      marginVertical: 4,
                    }}
                  >
                    {book.text}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      <Text style={{ fontWeight: "bold" }}>Completed: </Text>
                      {Math.round(book.progress * 100)}%
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      <Text style={{ fontWeight: "bold" }}>Total Pages: </Text>
                      300
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 6,
                      backgroundColor: "#E5E5E5",
                      borderRadius: 3,
                      marginTop: 4,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: 6,
                        backgroundColor: "#722F37",
                        width: `${book.progress * 100}%`,
                        borderRadius: 3,
                      }}
                    />
                  </View>
                </View>
                <Image
                  source={require("../../../assets/images/home/arrow-right.png")}
                  style={{ width: 16, height: 16, marginLeft: 8 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {editMode && (
                <TouchableOpacity
                  onPress={() => toggleSelectBook(book.id)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "#722F37",
                    marginLeft: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: selectedBooks.includes(book.id)
                      ? "#722F37"
                      : "#fff",
                  }}
                >
                  {selectedBooks.includes(book.id) && (
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}

          {activeTab === "finished" && booksData.length === 0 && (
            <Text
              style={{ textAlign: "center", marginTop: 20, color: "#A1A1A1" }}
            >
              You have finished all your books!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Delete Button */}
      {editMode && selectedBooks.length > 0 && (
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
                Delete
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
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
              Are you Sure?
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 20 }}>
              Are you sure you want to delete {selectedBooks.length} book(s)?
              This can’t be undone.
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
                  Delete
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
