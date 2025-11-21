import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import Svg, { G, Circle as SvgCircle } from "react-native-svg";
import { BookService, UserBook } from "../../lib/books";
import { useUserStore } from "../store/user-store";
import { ChevronRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function CurrentlyReading() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookId?: string }>();
  const { user } = useUserStore();
  const [currentBook, setCurrentBook] = useState<UserBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingSessions, setReadingSessions] = useState<any[]>([]);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchCurrentBook = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let bookToShow: UserBook | null = null;

        if (params.bookId) {
          const { data: allBooks } = await BookService.getUserBooks(
            user.id,
            "currently_reading"
          );
          if (allBooks) {
            bookToShow =
              allBooks.find((book) => book.id === params.bookId) || null;
          }
        } else {
          const { data } = await BookService.getUserBooks(
            user.id,
            "currently_reading"
          );
          if (data && data.length > 0) {
            bookToShow = data[0];
          }
        }

        if (bookToShow) {
          setCurrentBook(bookToShow);

          const { data: sessions } = await BookService.getUserReadingSessions(
            user.id,
            bookToShow.book_id
          );

          if (sessions) {
            setReadingSessions(sessions);
          }
        } else {
          setCurrentBook(null);
        }
      } catch (error) {
        console.error("Error fetching current book:", error);
        setCurrentBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentBook();
  }, [user?.id, params.bookId]);

  const progress = currentBook ? currentBook.progress / 100 : 0;
  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - circumference * progress;

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const generateWeekData = () => {
    const weekData = [];
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
    );

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekData.push({
        day: days[i],
        date: date.getDate().toString(),
        fullDate: date,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    return weekData;
  };

  const weekData = generateWeekData();

  const book = currentBook?.book;
  const totalPages = book?.page_count || 0;
  const completedPages = Math.round((progress * totalPages) / 100);
  const pagesLeft = Math.max(0, totalPages - completedPages);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#722F37" />
      </View>
    );
  }

  if (!currentBook || !book) {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#fff",
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="flex-row items-center justify-between mb-4 mt-10 w-full">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("../../assets/images/book/arrow-left.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text className="text-xl font-semibold ml-4">
              Currently Reading
            </Text>
          </View>
        </View>

        <Image
          source={require("../../assets/images/signup/monkey4.png")}
          className="w-48 h-48 mb-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-medium text-center mb-2">
          No Book Currently Reading
        </Text>
        <Text className="text-[#141414] text-center mb-4 px-4 text-lg">
          Add a book to start reading!
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/book/page1")}
          className="bg-[#722F37] w-full py-4 rounded-lg items-center justify-center"
        >
          <Text className="text-white font-bold text-center">Add a Book</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <>
      {/* ===================== MAIN SCREEN ===================== */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#fff",
          padding: 16,
        }}
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between mb-4 mt-8">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("../../assets/images/book/arrow-left.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text className="text-xl font-semibold ml-4">Book Details</Text>
          </View>
        </View>

        {/* CIRCLE PROGRESS */}
        <View className="items-center mb-6">
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              <SvgCircle
                stroke="#E5E5E5"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <SvgCircle
                stroke="#722F37"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>

          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontSize: 36, fontWeight: "bold", color: "#141414" }}
            >
              {Math.round(progress * 100)}%
            </Text>
            <Text style={{ fontSize: 20, color: "#555" }}>Completed</Text>
          </View>
        </View>

        <Text className="text-2xl font-semibold text-center mb-2">
          {book.title}
        </Text>
        <Text className="text-center text-[#A1A1A1] mb-2">
          By {book.author}
        </Text>

        {/* ===================== STATS ===================== */}
        <View className="flex-row justify-center items-center p-4 mb-2">
          <View className="items-center flex-1">
            <Text className="text-2xl">{totalPages}</Text>
            <Text className="font-semibold text-[#141414] text-lg">
              Total Pages
            </Text>
          </View>
          <View className="h-20 w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-2xl">{completedPages}</Text>
            <Text className="font-semibold text-[#141414] text-lg">
              Completed
            </Text>
          </View>
          <View className="h-20 w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-2xl">{pagesLeft}</Text>
            <Text className="font-semibold text-[#141414] text-lg">
              Pages Left
            </Text>
          </View>
        </View>

        {/* ===================== NEW LIST ITEMS ===================== */}
        <View
          style={{
            height: 48,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/book/clock.png")}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              tintColor: "#722F37",
            }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 16, color: "#141414", fontWeight: "500" }}>
            At your pace, you’ll finish in 30 days
          </Text>
        </View>

        <View
          style={{
            height: 48,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={require("../../assets/images/book/calendar.png")}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              tintColor: "#722F37",
            }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 16, color: "#141414", fontWeight: "500" }}>
            Completion Date: Nov 30, 2025
          </Text>
        </View>

        <View className="border-t border-gray-200 my-4" />

        {/* ===================== PLAN HEADER ===================== */}
        <View className="flex-row justify-between items-center mb-2 mt-4">
          <Text className="text-2xl font-semibold text-[#141414]">
            Your Reading Plan
          </Text>
          <TouchableOpacity onPress={() => setShowEditPopup(true)}>
            <Text className="text-[#722F37] font-bold underline">
              Edit Plan
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-4">
          <Text className="font-semibold text-[#141414] mr-2 text-lg">
            Today:
          </Text>
          <Text className="text-[#141414] text-lg">{formattedDate}</Text>
        </View>

        {/* ===================== WEEK BAR ===================== */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {weekData.map((day, idx) => (
            <View
              key={idx}
              style={{ alignItems: "center", marginRight: 8, width: 55 }}
            >
              <View
                style={{
                  height: 100,
                  width: 50,
                  borderWidth: 1,
                  borderColor: day.isToday ? "#722F37" : "#EFDFBB",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "#555" }}
                  >
                    -
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1.2,
                    backgroundColor: "#FDF6E7",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontWeight: "600", color: "#555" }}>
                    {day.day}
                  </Text>
                </View>
              </View>

              {day.isToday && (
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: "#722F37",
                    marginTop: 6,
                  }}
                />
              )}
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* ===================== EDIT POPUP ===================== */}
      <Modal visible={showEditPopup} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: width - 40,
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#141414" }}
              >
                {book.title}
              </Text>
              <TouchableOpacity onPress={() => setShowEditPopup(false)}>
                <Image
                  source={require("../../assets/images/home/close.png")}
                  style={{ width: 22, height: 22 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setShowEditPopup(false);
                router.push("/(tabs)/book/page2");
              }}
              className="h-12 border border-[#EFDFBB] rounded-xl mt-4 flex-row items-center px-3 justify-between"
            >
              <Text className="text-base font-medium">Update Reading Plan</Text>

              <ChevronRight size={20} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowEditPopup(false);
                setShowDeleteConfirm(true);
              }}
              className="h-12 border border-[#EFDFBB] rounded-xl mt-3 flex-row items-center px-3 justify-between"
            >
              <Text className="text-base font-medium">Delete Book</Text>

              <ChevronRight size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===================== DELETE CONFIRM ===================== */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
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
              style={{ fontSize: 18, fontWeight: "bold", color: "#141414" }}
            >
              Are you sure?
            </Text>

            <Text style={{ marginTop: 8, marginBottom: 20, fontSize: 14 }}>
              Do you really want to delete this book? This cannot be undone.
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteConfirm(false);
                }}
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
                onPress={() => setShowDeleteConfirm(false)}
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
    </>
  );
}
