import { useRouter } from "expo-router";
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
import { BookService } from "../../../lib/books";
import { GoalsService } from "../../../lib/goals";
import { ReadingPlanService } from "../../../lib/reading-plans";
import { supabase } from "../../../lib/supabase";
import { useUserStore } from "../../store/user-store";

const { width } = Dimensions.get("window");

// Format number with K suffix (e.g., 1000 -> 1K)
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export default function MyProfile() {
  const router = useRouter();
  const { user } = useUserStore();
  const signOut = useUserStore((state) => state.signOut);

  // Profile data state
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    username?: string;
  } | null>(null);
  const [stats, setStats] = useState({
    booksRead: 0,
    pagesRead: 0,
    badges: 0,
    daysStreak: 0,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Calculate reading streak (consecutive days with reading sessions)
  const calculateReadingStreak = (sessions: any[]): number => {
    if (!sessions || sessions.length === 0) return 0;

    // Get unique dates from sessions
    const uniqueDates = new Set(
      sessions.map((session) => {
        const date = new Date(session.session_date);
        return date.toISOString().split("T")[0];
      })
    );

    const sortedDates = Array.from(uniqueDates).sort().reverse();
    if (sortedDates.length === 0) return 0;

    // Check if today or yesterday has a session
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Start counting from today or yesterday
    let currentDate = sortedDates.includes(todayStr)
      ? new Date(today)
      : sortedDates.includes(yesterdayStr)
        ? new Date(yesterday)
        : null;

    if (!currentDate) return 0;

    let streak = 0;
    let checkDate = new Date(currentDate);

    while (true) {
      const checkDateStr = checkDate.toISOString().split("T")[0];
      if (sortedDates.includes(checkDateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Calculate badges based on completed achievement goals
  const calculateBadges = async (userId: string): Promise<number> => {
    try {
      const { data: achievementGoals } =
        await GoalsService.getAchievementGoals(userId);
      if (!achievementGoals) return 0;

      // Count completed goals
      return achievementGoals.filter((goal) => goal.completed).length;
    } catch (error) {
      console.error("Error calculating badges:", error);
      return 0;
    }
  };

  // Calculate total pages read based on reading plans and days passed
  const calculateTotalPagesFromPlans = async (
    userId: string
  ): Promise<number> => {
    try {
      // Fetch all active reading plans
      const { data: readingPlans, error } =
        await ReadingPlanService.getUserReadingPlans(userId);

      if (error || !readingPlans || readingPlans.length === 0) {
        return 0;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let totalPages = 0;

      for (const plan of readingPlans) {
        const planStartDate = new Date(plan.created_at);
        planStartDate.setHours(0, 0, 0, 0);

        // Calculate days passed since plan creation
        const daysDiff = Math.floor(
          (today.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Only count days that have passed (not including today if plan was created today)
        const daysPassed = Math.max(0, daysDiff);

        if (plan.plan_type === "everyday" && plan.pages_per_day) {
          // For everyday plans: days passed * pages per day
          totalPages += daysPassed * plan.pages_per_day;
        } else if (plan.plan_type === "weekly" && plan.weekly_schedule) {
          // For weekly plans: calculate based on weekly schedule
          const weeklySchedule = plan.weekly_schedule;
          const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

          // Calculate total pages per week
          let pagesPerWeek = 0;
          for (const day of daysOfWeek) {
            pagesPerWeek += weeklySchedule[day] || 0;
          }

          // Calculate full weeks passed
          const fullWeeks = Math.floor(daysPassed / 7);

          // Calculate remaining days in the current week
          const remainingDays = daysPassed % 7;
          let remainingPages = 0;

          // Calculate pages for remaining days
          for (let i = 0; i < remainingDays; i++) {
            const dayIndex = (planStartDate.getDay() + i) % 7;
            const dayName = daysOfWeek[dayIndex];
            remainingPages += weeklySchedule[dayName] || 0;
          }

          totalPages += fullWeeks * pagesPerWeek + remainingPages;
        }
      }

      return totalPages;
    } catch (error) {
      console.error("Error calculating total pages from plans:", error);
      return 0;
    }
  };

  // Fetch user profile and statistics
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch user profile from users table
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("first_name, last_name, avatar_url, username")
          .eq("id", user.id)
          .single();

        if (!profileError && profileData) {
          setUserProfile(profileData);
        }

        // Fetch reading statistics
        const { data: readingStats, error: statsError } =
          await BookService.getUserReadingStats(user.id);

        if (!statsError && readingStats) {
          setStats((prev) => ({
            ...prev,
            booksRead: readingStats.totalBooksRead || 0,
          }));
        }

        // Calculate total pages read based on reading plans
        const totalPagesFromPlans = await calculateTotalPagesFromPlans(user.id);
        setStats((prev) => ({
          ...prev,
          pagesRead: totalPagesFromPlans,
        }));

        // Calculate reading streak from reading sessions
        const { data: sessions, error: sessionsError } =
          await BookService.getUserReadingSessions(user.id);

        if (!sessionsError && sessions) {
          const streak = calculateReadingStreak(sessions);
          setStats((prev) => ({ ...prev, daysStreak: streak }));
        }

        // Calculate badges based on completed achievement goals
        const badges = await calculateBadges(user.id);
        setStats((prev) => ({ ...prev, badges }));
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = userProfile
    ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
    : user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`.trim()
      : user?.email?.split("@")[0] || "User";

  const displayUsername = userProfile?.username
    ? `@${userProfile.username}`
    : user?.email
      ? `@${user.email.split("@")[0]}`
      : "";

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#722F37" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="w-full h-24 bg-[#722F37] flex-row items-center justify-between px-5 mt-16">
        <Text className="text-white text-2xl font-bold">My Profile</Text>
      </View>

      <View className="flex-row px-5 py-6 items-center">
        {userProfile?.avatar_url ? (
          <Image
            source={{ uri: userProfile.avatar_url }}
            className="w-16 h-16 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../../../assets/images/profile/user.png")}
            className="w-16 h-16 rounded-full"
            resizeMode="contain"
          />
        )}

        <View className="ml-4">
          <Text className="text-lg font-semibold">{displayName}</Text>
          {displayUsername && (
            <Text className="text-gray-500 mt-1">{displayUsername}</Text>
          )}
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between px-5 mt-2">
        <View className="w-[48%] border border-[#EFDFBB] rounded-xl py-5 mb-4 items-center">
          <Text className="text-lg text-gray-700 mb-2 font-semibold">
            Finished
          </Text>
          <Text className="text-md">
            {stats.booksRead} Book{stats.booksRead !== 1 ? "s" : ""}
          </Text>
        </View>

        <View className="w-[48%] border border-[#EFDFBB] rounded-xl py-5 mb-4 items-center">
          <Text className="text-lg text-gray-700 mb-2 font-semibold">
            Total Read
          </Text>
          <Text className="text-md">
            {formatNumber(stats.pagesRead)} Page
            {stats.pagesRead !== 1 ? "s" : ""}
          </Text>
        </View>

        <View className="w-[48%] border border-[#EFDFBB] rounded-xl py-5 mb-4 items-center">
          <Text className="text-lg text-gray-700 mb-2 font-semibold">
            Badges
          </Text>
          <Text className="text-md">{stats.badges}</Text>
        </View>

        <View className="w-[48%] border border-[#EFDFBB] rounded-xl py-5 mb-4 items-center">
          <Text className="text-lg text-gray-700 mb-2 font-semibold">
            Days Streak
          </Text>
          <Text className="text-md">{stats.daysStreak}</Text>
        </View>
      </View>

      <View className="px-5 mt-4">
        <TouchableOpacity
          className="flex-row justify-between items-center py-4"
          onPress={() => router.push("/my-shelf")}
        >
          <View className="flex-row items-center">
            <Image
              source={require("../../../assets/images/profile/book.png")}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-lg font-semibold">My Books</Text>
          </View>

          {/* <ChevronRight size={20} color="#000" /> */}
        </TouchableOpacity>

        <View className="w-full h-[1px] bg-gray-200" />

        {/* Privacy Policy */}
        <TouchableOpacity
          className="flex-row justify-between items-center py-4"
          onPress={() => router.push("/profile/privacy-policy")}
        >
          <View className="flex-row items-center mt-4">
            <Image
              source={require("../../../assets/images/profile/secure.png")}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-lg font-semibold">Privacy Policy</Text>
          </View>

          {/* <ChevronRight size={20} color="#000" /> */}
        </TouchableOpacity>
      </View>

      <View className="px-5 mt-6 mb-10">
        <TouchableOpacity
          className="bg-[#722F37] py-4 rounded-xl mb-4"
          onPress={() => router.push("/profile/settings")}
        >
          <Text className="text-white text-center font-semibold text-base">
            Profile Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-[#722F37] py-4 rounded-xl"
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#722F37" />
          ) : (
            <Text className="text-[#722F37] text-center font-semibold text-base">
              Logout
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
