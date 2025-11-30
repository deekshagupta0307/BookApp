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
import { ReadingPlan, ReadingPlanService } from "../../lib/reading-plans";
import { useUserStore } from "../store/user-store";

const { width } = Dimensions.get("window");

export default function CurrentlyReading() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookId?: string }>();
  const { user } = useUserStore();
  const [currentBook, setCurrentBook] = useState<UserBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingSessions, setReadingSessions] = useState<any[]>([]);
  const [readingPlan, setReadingPlan] = useState<ReadingPlan | null>(null);

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

          // Fetch reading plan for this book
          const { data: plan, error: planError } = 
            await ReadingPlanService.getActivePlanForBook(user.id, bookToShow.book_id);
          if (!planError && plan) {
            setReadingPlan(plan);
          }
        } else {
          setCurrentBook(null);
          setReadingPlan(null);
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

  // Get book reference
  const book = currentBook?.book;

  // Calculate progress based on pages supposed to be read by today and past days
  const calculateProgress = () => {
    if (!currentBook || !book || !readingPlan) {
      return currentBook ? currentBook.progress / 100 : 0;
    }

    const totalPages = book.page_count || 0;
    if (totalPages === 0) return 0;

    // Calculate total pages supposed to be read by today (including today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let totalPagesSupposedToRead = 0;
    const startDate = currentBook.started_at 
      ? new Date(currentBook.started_at)
      : new Date(readingPlan.created_at);
    startDate.setHours(0, 0, 0, 0);

    if (readingPlan.plan_type === 'everyday' && readingPlan.pages_per_day) {
      // For everyday plan: count all days from start to today (inclusive)
      const daysDiff = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      totalPagesSupposedToRead = daysDiff * readingPlan.pages_per_day;
    } else if (readingPlan.plan_type === 'weekly' && readingPlan.weekly_schedule) {
      // For weekly plan: count only scheduled days from start to today
      const schedule = readingPlan.weekly_schedule;
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      let currentDate = new Date(startDate);
      while (currentDate <= today) {
        const dayName = dayNames[currentDate.getDay()];
        const pagesForDay = schedule[dayName] || 0;
        totalPagesSupposedToRead += pagesForDay;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Progress percentage is based on pages supposed to be read by today (including today)
    // This shows how much of the book should have been read according to the plan
    const progressPercentage = Math.min(100, (totalPagesSupposedToRead / totalPages) * 100);
    
    return progressPercentage / 100;
  };

  const progress = calculateProgress();
  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - circumference * progress;

  const today = new Date();
  const formatDateWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const ordinal = day === 1 || day === 21 || day === 31 ? 'st' :
                    day === 2 || day === 22 ? 'nd' :
                    day === 3 || day === 23 ? 'rd' : 'th';
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${weekday}, ${day}${ordinal} ${month}, ${year}`;
  };
  const formattedDate = formatDateWithOrdinal(today);

  // Generate week data dynamically
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

  // Calculate book statistics
  const totalPages = book?.page_count || 0;
  // Calculate actual pages read from reading sessions
  const actualPagesRead = readingSessions.reduce((sum, session) => sum + session.pages_read, 0);
  const completedPages = Math.min(actualPagesRead, totalPages);
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
            <Text className="text-xl font-semibold ml-4">Book Details</Text>
          </View>
        </View>

        <Image
          source={require("../../assets/images/signup/monkey4.png")}
          className="w-48 h-48 mb-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-medium text-center mb-2">
          No Book Book Details
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
          <Text className="text-xl font-semibold ml-4">Book Details</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/shelf/menu2.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
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

          // Determine if this day should be colored based on reading plan
          let shouldBeColored = false;
          let pagesExpected = 0;
          let isCompleted = false;

          if (readingPlan) {
            if (readingPlan.plan_type === 'everyday' && readingPlan.pages_per_day) {
              // Everyday plan: all days should be colored
              shouldBeColored = true;
              pagesExpected = readingPlan.pages_per_day;
            } else if (readingPlan.plan_type === 'weekly' && readingPlan.weekly_schedule) {
              // Weekly plan: only days with non-zero values should be colored
              const schedule = readingPlan.weekly_schedule;
              // Explicitly check if day exists in schedule and convert to number
              const dayValue = schedule[day.day];
              // Convert to number and ensure it's a valid positive number
              pagesExpected = (dayValue !== undefined && dayValue !== null) 
                ? Number(dayValue) 
                : 0;
              // Only color if pagesExpected is explicitly greater than 0
              // Also check for NaN in case of invalid values
              shouldBeColored = !isNaN(pagesExpected) && pagesExpected > 0;
            }
          }

          // Check if day is completed (pages read >= pages expected)
          if (shouldBeColored && pagesExpected > 0) {
            isCompleted = pagesRead >= pagesExpected;
          }

          // Determine background color for the day card
          // Half colored means: if it's supposed to be read (shouldBeColored), use beige background
          const dayBackgroundColor = shouldBeColored ? "#EFDFBB" : "#fff";
          const dayTextColor = shouldBeColored ? "#722F37" : "#555";

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
                  {isCompleted ? (
                    <Text style={{ color: "#722F37", fontSize: 20, fontWeight: "bold" }}>
                      ✓
                    </Text>
                  ) : (
                    <Text
                      style={{ color: "#555", fontSize: 16, fontWeight: "bold" }}
                    >
                      {pagesRead > 0 ? pagesRead : "-"}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    flex: 1.2,
                    backgroundColor: dayBackgroundColor,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: dayTextColor, fontWeight: "600" }}>
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

      <View className="flex-row justify-between items-center mt-4 mb-4">
        <View>
          <Text className="text-[#141414] font-semibold text-lg">
            Today's Goal: {readingPlan && readingPlan.plan_type === 'everyday' && readingPlan.pages_per_day
              ? `${readingPlan.pages_per_day} pages`
              : readingPlan && readingPlan.plan_type === 'weekly' && readingPlan.weekly_schedule
              ? (() => {
                  const today = new Date();
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const todayName = dayNames[today.getDay()];
                  const pages = readingPlan.weekly_schedule[todayName] || 0;
                  return pages > 0 ? `${pages} pages` : '--';
                })()
              : '--'}
          </Text>
        </View>
        <View>
          <Text className="text-[#141414] font-semibold text-lg">
            Next Goal On: {(() => {
              if (!readingPlan) return '--';
              
              const today = new Date();
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              
              if (readingPlan.plan_type === 'everyday') {
                return 'Tomorrow';
              } else if (readingPlan.plan_type === 'weekly' && readingPlan.weekly_schedule) {
                // Find next day with pages > 0
                for (let i = 1; i <= 7; i++) {
                  const nextDay = new Date(today);
                  nextDay.setDate(today.getDate() + i);
                  const nextDayName = dayNames[nextDay.getDay()];
                  const pages = readingPlan.weekly_schedule[nextDayName] || 0;
                  if (pages > 0) {
                    return nextDayName;
                  }
                }
                return '--';
              }
              return '--';
            })()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
