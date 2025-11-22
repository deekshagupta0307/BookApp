import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { BookService, UserBook } from "../../../lib/books";
import { useUserStore } from "../../store/user-store";

const { width } = Dimensions.get("window");

export default function ReadingNow() {
  const [activeTab, setActiveTab] = useState<"reading" | "finished">("reading");
  const [booksData, setBooksData] = useState<UserBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<UserBook[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { user } = useUserStore();

  // Fetch user books based on active tab
  useEffect(() => {
    const fetchBooks = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const status = activeTab === "reading" ? "currently_reading" : "read";
        const { data, error } = await BookService.getUserBooks(user.id, status);

        if (error) {
          console.error("Error fetching books:", error);
          setBooksData([]);
        } else {
          setBooksData(data || []);
          setFilteredBooks(data || []);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooksData([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user?.id, activeTab]);

  // Filter books based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(booksData);
    } else {
      const filtered = booksData.filter(
        (book) =>
          book.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.book?.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, booksData]);

  const toggleSelectBook = (id: string) => {
    setSelectedBooks((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      // Delete all selected books from the database
      const deletePromises = selectedBooks.map((bookId) =>
        BookService.removeBookFromUser(bookId)
      );

      await Promise.all(deletePromises);

      // Remove deleted books from local state
      setBooksData(
        booksData.filter((book) => !selectedBooks.includes(book.id))
      );
      setFilteredBooks(
        filteredBooks.filter((book) => !selectedBooks.includes(book.id))
      );
      setSelectedBooks([]);
      setEditMode(false);
      setShowDialog(false);
    } catch (error) {
      console.error("Error deleting books:", error);
      // Still update UI even if there's an error (optimistic update)
      setBooksData(
        booksData.filter((book) => !selectedBooks.includes(book.id))
      );
      setFilteredBooks(
        filteredBooks.filter((book) => !selectedBooks.includes(book.id))
      );
      setSelectedBooks([]);
      setEditMode(false);
      setShowDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: "#722F37", padding: 16 }}>
          <View className="flex-row justify-between items-center mt-10">
            <Text className="text-white font-semibold text-2xl">My Shelf</Text>
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
                    setSearchQuery("");
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
              value={searchQuery}
              onChangeText={setSearchQuery}
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
                ? `Reading Now: ${filteredBooks.length}`
                : `Finished Books: ${filteredBooks.length}`}
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

          {loading ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#722F37" />
              <Text className="text-gray-600 mt-4">Loading books...</Text>
            </View>
          ) : filteredBooks.length === 0 ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <Text className="text-center text-gray-600">
                {searchQuery
                  ? "No books found matching your search."
                  : activeTab === "reading"
                  ? "You're not reading any books right now. Add a book to get started!"
                  : "You haven't finished any books yet."}
              </Text>
            </View>
          ) : (
            filteredBooks.map((book) => (
              <View
                key={book.id}
                className="flex-row items-center mb-4"
                style={{ alignItems: "center" }}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/currently-reading?bookId=${book.id}`)}
                  className="flex-1 flex-row border rounded-lg p-5 border-[#EFDFBB] bg-white"
                  style={{ minHeight: 120, opacity: editMode ? 0.8 : 1 }}
                >
                  {book.book?.cover_url ? (
                    <Image
                      source={{ uri: book.book.cover_url }}
                      className="w-10 h-10 mr-4"
                      resizeMode="contain"
                      style={{ borderRadius: 4 }}
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/images/home/book.png")}
                      className="w-10 h-10 mr-4"
                      resizeMode="contain"
                    />
                  )}
                  <View className="flex-1 justify-center">
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      className="text-[#141414] font-semibold text-lg"
                    >
                      {book.book?.title || "Unknown Book"}
                    </Text>
                    <Text
                      className="text-[#141414] mb-4"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      By {book.book?.author || "Unknown Author"}
                    </Text>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-[#141414] text-sm">
                        <Text className="font-bold">Completed: </Text>
                        {book.progress}%
                      </Text>
                      <Text className="text-[#141414] text-sm">
                        <Text className="font-bold">Total Pages: </Text>
                        {book.book?.page_count || "N/A"}
                      </Text>
                    </View>
                    <View
                      className="h-3 bg-gray-300 rounded-full"
                      style={{ overflow: "hidden", width: "100%" }}
                    >
                      <View
                        className="h-3 bg-[#722F37] rounded-full"
                        style={{ width: `${Math.min(book.progress, 100)}%` }}
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
            ))
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
