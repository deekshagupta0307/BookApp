import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router"; // import router
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BookService, UserBook } from "../../lib/books";
import { ReadingPlan, ReadingPlanService } from "../../lib/reading-plans";
import { StreakService } from "../../lib/streak";
import { useUserStore } from "../store/user-store";

const { width } = Dimensions.get("window");

export default function HomePage() {
  const firstName = useUserStore((s) => s.firstName);
  const { user } = useUserStore();
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState<
    UserBook[]
  >([]);
  const [finishedBooks, setFinishedBooks] = useState<UserBook[]>([]);
  const [pagesReadToday, setPagesReadToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [readingPlans, setReadingPlans] = useState<Record<string, ReadingPlan>>({});

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Fetch user's books - refetch when screen comes into focus
  const fetchUserBooks = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch all books categorized
      const { data: categorizedData, error: categorizedError } = await BookService.getCategorizedUserBooks(
        user.id
      );

      if (!categorizedError && categorizedData) {
        setCurrentlyReadingBooks(categorizedData.currentlyReading);
        setFinishedBooks(categorizedData.read);
      }

      // Fetch pages read today
      const { data: sessionsData, error: sessionsError } = await BookService.getUserReadingSessions(
        user.id
      );
      if (!sessionsError && sessionsData) {
        const todayDate = new Date();
        const todayStr = todayDate.toISOString().split("T")[0];
        const todayPages = sessionsData
          .filter((session) => {
            const sessionDate = new Date(session.session_date).toISOString().split("T")[0];
            return sessionDate === todayStr;
          })
          .reduce((sum, session) => sum + session.pages_read, 0);
        setPagesReadToday(todayPages);
      }

      const { data: plans } = await ReadingPlanService.getUserReadingPlans(user.id);
      if (plans) {
        const plansMap: Record<string, ReadingPlan> = {};
        plans.forEach((plan) => {
          plansMap[plan.book_id] = plan;
        });
        setReadingPlans(plansMap);
      }

      // Update Streak
      const currentStreak = await StreakService.checkAndIncrementStreak(user);
      setStreak(currentStreak);

    } catch (error) {
      console.error("Error fetching user books:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserBooks();
    }, [fetchUserBooks])
  );

  const renderVerticalCards = (fetchUserBooks: UserBook[]) =>
    fetchUserBooks.map((userBook) => {
      const book = userBook.book;
      if (!book) return null;

      return (
        <TouchableOpacity
          key={userBook.id}
          onPress={() =>
            router.push(`/currently-reading?bookId=${userBook.id}`)
          }
          className="flex-row border rounded-lg p-5 mb-4 border-[#EFDFBB] bg-white"
          style={{ minHeight: 120 }}
        >
          {book.cover_url ? (
            <Image
              source={{ uri: book.cover_url }}
              className="w-10 h-10 mr-4"
              resizeMode="contain"
              style={{ borderRadius: 4 }}
            />
          ) : (
            <Image
              source={require("../../assets/images/home/book.png")}
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
              {book.title}
            </Text>

            <Text className="text-[#141414] mb-4" numberOfLines={1}>
              By {book.author}
            </Text>

            <View className="flex-row justify-between mb-1">
              <Text className="text-[#141414] text-sm">
                <Text className="font-bold">Completed: </Text>
                {ReadingPlanService.calculatePlanProgress(
                  userBook,
                  readingPlans[userBook.book_id]
                )}%
              </Text>
              <Text className="text-[#141414] text-sm">
                <Text className="font-bold">Total Pages: </Text>
                {book.page_count || "N/A"}
              </Text>
            </View>

            <View
              className="h-3 bg-gray-300 rounded-full"
              style={{ overflow: "hidden", width: "100%" }}
            >
              <View
                className="h-3 bg-[#722F37] rounded-full"
                style={{
                  width: `${Math.min(
                    ReadingPlanService.calculatePlanProgress(
                      userBook,
                      readingPlans[userBook.book_id]
                    ),
                    100
                  )}%`,
                }}
              />
            </View>
          </View>

          <View className="justify-center ml-2">
            <Image
              source={require("../../assets/images/home/arrow-right.png")}
              className="w-5 h-5 mb-6"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      );
    });

  const handleAddBookPress = () => {
    setButtonLoading(true);
    setTimeout(() => {
      router.push("/(tabs)/book/page1");
      setButtonLoading(false);
    }, 500);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FFFFFF" }}>
      {/* Top Header */}
      <View className="bg-[#722F37] p-6 pt-16">
        <View className="flex-row items-center">
          <Image
            source={require("../../assets/images/home/logo.png")}
            className="w-8 h-8"
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/images/home/pagepal.png")}
            className="w-20 ml-2"
            resizeMode="contain"
          />
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-white text-3xl font-semibold mb-2">
              Welcome {firstName || "Friend"}!
            </Text>
            <Text className="text-white text-base">
              What’s on Your Mind Today?
            </Text>
          </View>

          <Image
            source={require("../../assets/images/signup/monkey5.png")}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Date + Fire */}
      <View className="flex-row justify-between items-center px-6 mt-4">
        <Text className="text-[#141414] text-lg">
          <Text className="font-bold">Today: </Text>
          {formattedDate}
        </Text>

        <View className="flex-row items-center px-4 py-2 rounded-full border border-[#EFDFBB] bg-[#FDF6E7]">
          <Image
            source={require("../../assets/images/home/fire.png")}
            className="w-5 h-5 mr-2"
            resizeMode="contain"
          />
          <Text className="font-semibold text-[#141414]">{streak}</Text>
        </View>
      </View>

      {/* Tabs - NOW NON-CLICKABLE */}
      <View className="flex-row justify-between mb-4 p-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["today", "reading", "finished"].map((tab) => {
            let title = "";
            let desc = "";

            if (tab === "today") {
              title = "Read Today";
              desc = `${pagesReadToday} Page(s)`;
            }
            if (tab === "reading") {
              title = "Currently Reading";
              desc = `${currentlyReadingBooks.length} Book(s)`;
            }
            if (tab === "finished") {
              title = "Finished Reading";
              desc = `${finishedBooks.length} Book(s)`;
            }

            return (
              <View
                key={tab}
                className="w-[140] mr-4 p-4 rounded-lg border bg-white border-[#EFDFBB]"
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-center font-semibold text-[#141414]"
                >
                  {title}
                </Text>

                <Text className="text-center text-sm mt-1 text-[#141414]">
                  {desc}
                </Text>
              </View>

            );
          })}
        </ScrollView>
      </View>

      <View className="px-6">
        <Text className="text-2xl font-bold mb-4">Currently Reading</Text>
        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#722F37" />
          </View>
        ) : currentlyReadingBooks.length === 0 ? (
          <View className="items-center py-10">
            <Image
              source={require("../../assets/images/signup/monkey4.png")}
              className="w-48 h-48 mb-4"
              resizeMode="contain"
            />
            <Text className="text-xl font-medium text-center mb-2">
              No Books Currently Reading
            </Text>
            <Text className="text-[#141414] text-center mb-4 px-4 text-lg">
              Add a book to start reading!
            </Text>
            <TouchableOpacity
              onPress={handleAddBookPress}
              className="bg-[#722F37] w-full py-4 rounded-lg items-center justify-center flex-row"
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-bold text-center">
                  Add a Book
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          renderVerticalCards(currentlyReadingBooks)
        )}
      </View>
    </ScrollView>
  );
}
