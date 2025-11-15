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
} from "react-native";
import Svg, { G, Circle as SvgCircle } from "react-native-svg";
import { BookService, UserBook } from "../../lib/books";
import { useUserStore } from "../store/user-store";

const { width } = Dimensions.get("window");

export default function CurrentlyReading() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookId?: string }>();
  const { user } = useUserStore();
  const [currentBook, setCurrentBook] = useState<UserBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingSessions, setReadingSessions] = useState<any[]>([]);

  // Fetch user's currently reading book
  useEffect(() => {
    const fetchCurrentBook = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let bookToShow: UserBook | null = null;

        // If bookId is provided, fetch that specific book
        if (params.bookId) {
          const { data: allBooks, error } = await BookService.getUserBooks(
            user.id,
            "currently_reading"
          );

          if (!error && allBooks) {
            bookToShow = allBooks.find((book) => book.id === params.bookId) || null;
          }
        } else {
          // If no bookId provided, get the first/most recent currently reading book
          const { data, error } = await BookService.getUserBooks(
            user.id,
            "currently_reading"
          );

          if (!error && data && data.length > 0) {
            bookToShow = data[0];
          }
        }

        if (bookToShow) {
          setCurrentBook(bookToShow);
          
          // Fetch reading sessions for this book
          const { data: sessions, error: sessionsError } = 
            await BookService.getUserReadingSessions(user.id, bookToShow.book_id);
          if (!sessionsError && sessions) {
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

  // Calculate progress
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

  // Generate week data dynamically
  const generateWeekData = () => {
    const weekData = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // Start from Monday

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const isToday = date.toDateString() === today.toDateString();
      
      weekData.push({
        day: days[i],
        date: date.getDate().toString(),
        fullDate: date,
        isToday,
      });
    }
    
    return weekData;
  };

  const weekData = generateWeekData();

  // Calculate book statistics
  const book = currentBook?.book;
  const totalPages = book?.page_count || 0;
  const completedPages = Math.round((progress * totalPages) / 100);
  const pagesLeft = Math.max(0, totalPages - completedPages);

  // Calculate estimated completion date (simple estimation)
  const calculateCompletionDate = () => {
    if (!currentBook || totalPages === 0 || pagesLeft === 0) return null;
    
    // Get average pages per day from reading sessions (last 7 days)
    const last7Days = readingSessions.filter((session) => {
      const sessionDate = new Date(session.session_date);
      const daysDiff = (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    
    if (last7Days.length === 0) return null;
    
    const avgPagesPerDay = last7Days.reduce((sum, s) => sum + s.pages_read, 0) / 7;
    if (avgPagesPerDay <= 0) return null;
    
    const daysToComplete = Math.ceil(pagesLeft / avgPagesPerDay);
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() + daysToComplete);
    
    return completionDate;
  };

  const completionDate = calculateCompletionDate();
  const daysToComplete = completionDate 
    ? Math.ceil((completionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
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
            <Text className="text-xl font-semibold ml-4">Currently Reading</Text>
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
          onPress={() => router.push("/(tabs)/Book/page1")}
          className="bg-[#722F37] w-full py-4 rounded-lg items-center justify-center"
        >
          <Text className="text-white font-bold text-center">Add a Book</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 16,
      }}
    >
      <View className="flex-row items-center justify-between mb-4 mt-10">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../assets/images/book/arrow-left.png")}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Currently Reading</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/shelf/menu2.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View className="items-center mt-10 mb-8">
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 36, fontWeight: "bold", color: "#141414" }}>
            {Math.round(progress * 100)}%
          </Text>
          <Text style={{ fontSize: 20, color: "#555" }}>Completed</Text>
        </View>
      </View>

      <Text className="text-2xl font-semibold text-center mb-2">
        {book.title}
      </Text>
      <Text className="text-center text-[#A1A1A1] mb-4">By {book.author}</Text>

      <View className="flex-row justify-center items-center p-4 mb-4">
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

      <View className="mb-4">
        {daysToComplete !== null && (
          <View className="flex-row items-center mb-2">
            <Image
              source={require("../../assets/images/book/clock.png")}
              className="w-5 h-5 mr-2"
              resizeMode="contain"
            />
            <Text className="text-[#141414] text-lg">
              At your pace, you'll finish in {daysToComplete} {daysToComplete === 1 ? 'day' : 'days'}
            </Text>
          </View>
        )}
        {completionDate && (
          <View className="flex-row items-center">
            <Image
              source={require("../../assets/images/book/calendar.png")}
              className="w-5 h-5 mr-2"
              resizeMode="contain"
            />
            <Text className="text-[#141414] text-lg">
              Completion Date: {completionDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        )}
      </View>

      <View className="border-t border-gray-200 my-4" />

      <View className="flex-row justify-between items-center mb-2 mt-4">
        <Text className="text-2xl font-semibold text-[#141414]">
          Your Reading Plan
        </Text>
        <TouchableOpacity>
          <Text className="text-[#722F37] font-bold underline">Edit Plan</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center mb-4">
        <Text className="font-semibold text-[#141414] mr-2 text-lg">
          Today:
        </Text>
        <Text className="text-[#141414] text-lg">{formattedDate}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekData.map((day, idx) => {
          // Get pages read for this day from reading sessions
          const dayStr = day.fullDate.toISOString().split("T")[0];
          const daySessions = readingSessions.filter((session) => {
            const sessionDate = new Date(session.session_date).toISOString().split("T")[0];
            return sessionDate === dayStr;
          });
          const pagesRead = daySessions.reduce((sum, s) => sum + s.pages_read, 0);

          return (
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
                    style={{ color: "#555", fontSize: 16, fontWeight: "bold" }}
                  >
                    {pagesRead > 0 ? pagesRead : "-"}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1.2,
                    backgroundColor: day.isToday ? "#FDF6E7" : "#FDF6E7",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                >
                  <Text style={{ color: "#555", fontWeight: "600" }}>
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
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}
