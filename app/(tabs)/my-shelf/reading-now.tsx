import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

export default function ReadingNow() {
  const [activeTab, setActiveTab] = useState<"reading" | "finished">("reading");
  const [booksData, setBooksData] = useState(initialBooksData);
  const [editMode, setEditMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const router = useRouter();

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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: "#722F37", padding: 16 }}>
          <View className="flex-row justify-between items-center mt-10">
            <Text className="text-white font-semibold text-2xl">My Shelf</Text>
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
            className="flex-row bg-white rounded-lg mt-6"
            style={{ overflow: "hidden" }}
          >
            {["reading", "finished"].map((tab) => {
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
                    {tab === "reading" ? "Reading Now" : "Finished Books"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
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
              placeholder="Search Book"
              placeholderTextColor="#141414"
              style={{ flex: 1, fontSize: 14, color: "#141414" }}
            />
          </View>
        </View>

        <View style={{ backgroundColor: "#fff", padding: 16 }}>
          <View
            className="flex-row justify-between items-center mb-4"
            style={{ width: "100%" }}
          >
            <Text className="text-lg font-medium text-[#141414]">
              {activeTab === "reading"
                ? `Reading Now: ${booksData.length}`
                : `Finished Books: ${booksData.length}`}
            </Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/Book/page1")}
              >
                <Text className="text-[#722F37] underline font-semibold mr-2">
                  Add Book
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEditMode(!editMode);
                  setSelectedBooks([]);
                }}
              >
                <Text className="text-[#722F37] underline font-semibold">
                  {editMode ? "Close" : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {booksData.map((book) => (
            <View
              key={book.id}
              className="flex-row items-center mb-4"
              style={{ alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={() => router.push("/currently-reading")}
                className="flex-1 flex-row border rounded-lg p-5 border-[#EFDFBB] bg-white"
                style={{ minHeight: 120, opacity: editMode ? 0.8 : 1 }}
              >
                <Image
                  source={require("../../../assets/images/home/book.png")}
                  className="w-10 h-10 mr-4"
                  resizeMode="contain"
                />
                <View className="flex-1 justify-center">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-[#141414] font-semibold text-lg"
                  >
                    {book.title}
                  </Text>
                  <Text
                    className="text-[#141414] mb-4"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {book.text}
                  </Text>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-[#141414] text-sm">
                      <Text className="font-bold">Completed: </Text>
                      {Math.round(book.progress * 100)}%
                    </Text>
                    <Text className="text-[#141414] text-sm">
                      <Text className="font-bold">Total Pages: </Text>300
                    </Text>
                  </View>
                  <View
                    className="h-3 bg-gray-300 rounded-full"
                    style={{ overflow: "hidden", width: "100%" }}
                  >
                    <View
                      className="h-3 bg-[#722F37] rounded-full"
                      style={{ width: `${book.progress * 100}%` }}
                    />
                  </View>
                </View>
                <Image
                  source={require("../../../assets/images/home/arrow-right.png")}
                  className="w-5 h-5 mb-6"
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
            <Text className="text-center text-gray-600 mt-10">
              You have finished all your books!
            </Text>
          )}
        </View>
      </ScrollView>

      {editMode && selectedBooks.length > 0 && (
        <View className="absolute bottom-4 left-0 right-0 px-4">
          <TouchableOpacity
            onPress={() => setShowDialog(true)}
            className="bg-[#722F37] py-4 rounded-lg items-center flex-row justify-center"
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

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
              Are you Sure?
            </Text>
            <Text style={{ fontSize: 14, color: "#141414", marginBottom: 20 }}>
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
