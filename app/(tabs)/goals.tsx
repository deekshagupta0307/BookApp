import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../app/store/user-store";
import { BookService } from "../../lib/books";
import { AchievementGoal, GoalsService } from "../../lib/goals";
import { StreakService } from "../../lib/streak";

export default function Goals() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const firstName = useUserStore((state) => state.firstName);
  const [goals, setGoals] = useState<AchievementGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState("Rookie Reader");
  const [completedBooks, setCompletedBooks] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchGoals();
  }, [user?.id]);

  const fetchGoals = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get user's reading stats
      const { data: stats } = await BookService.getUserReadingStats(user.id);
      const booksRead = stats?.totalBooksRead || 0;
      setCompletedBooks(booksRead);

      // Get current reading level
      const level = GoalsService.getCurrentReadingLevel(booksRead);
      setCurrentLevel(level);

      // Get streak
      const currentStreak = await StreakService.checkAndIncrementStreak(user);
      setStreak(currentStreak);

      // Fetch achievement goals
      const { data: achievementGoals, error } =
        await GoalsService.getAchievementGoals(user.id);

      if (error) {
        console.error("Error fetching goals:", error);
      } else if (achievementGoals) {
        setGoals(achievementGoals);
      }
    } catch (error) {
      console.error("Error in fetchGoals:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#722F37" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="w-full h-24 bg-[#722F37] flex-row items-center justify-between px-5 mt-6">
          <Text className="text-white text-2xl font-bold">My Goals</Text>
        </View>

        <View className="bg-white px-5 mt-8">
          <Text className="text-2xl font-bold">Hi {firstName || "User"}!</Text>

          <View className="flex-row justify-between items-center">
            <View className="w-[70%]">
              <Text className="text-base font-medium mb-8">
                You're Currently at{" "}
                <Text className="font-bold text-base">{currentLevel}</Text>
              </Text>
            </View>

            <Image
              source={require("../../assets/images/goals/badge.png")}
              className="w-24 h-24 -mt-6"
              resizeMode="contain"
            />
          </View>

          <View className="w-full h-[1px] bg-gray-300 mt-4 mb-4" />

          <View className="flex-row justify-between items-center mb-4 mt-8">
            <View className="flex-row items-center">
              <Text className="text-xl font-semibold mr-4">My Goals</Text>
              <View className="flex-row items-center px-3 py-1 rounded-full border border-[#EFDFBB] bg-[#FDF6E7]">
                <Image
                  source={require("../../assets/images/home/fire.png")}
                  className="w-4 h-4 mr-1"
                  resizeMode="contain"
                />
                <Text className="font-semibold text-[#141414] text-sm">{streak}</Text>
              </View>
            </View>

            <TouchableOpacity className="flex-row items-center bg-[#FDF6E7] border border-[#EFDFBB] rounded-full px-4 py-2">
              <Image
                source={require("../../assets/images/goals/target.png")}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <Text className="text-base font-semibold">{goals.length}</Text>
            </TouchableOpacity>
          </View>
          {goals.map((goal) => (
            <View
              key={goal.id}
              className="flex-row items-center mb-4"
              style={{ alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={() => { }}
                className="flex-1 flex-row border rounded-lg p-5 border-[#EFDFBB] bg-white"
                style={{ minHeight: 120 }}
              >
                <Image
                  source={require("../../assets/images/goals/icon.png")}
                  className="w-10 h-10 mr-4"
                  resizeMode="contain"
                />

                <View className="flex-1 justify-center">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-[#141414] font-semibold text-lg"
                  >
                    {goal.title}
                  </Text>

                  <Text
                    className="text-[#141414] mb-4"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {goal.description}
                  </Text>

                  <View className="flex-row justify-between mb-1">
                    <Text className="text-[#141414] text-sm">
                      <Text className="font-bold">Progress: </Text>
                      {goal.progress}%
                    </Text>
                    <Text className="text-[#141414] text-sm">
                      <Text className="font-bold">Target: </Text>
                      {goal.targetBooks}{" "}
                      {goal.targetBooks === 1 ? "book" : "books"}
                    </Text>
                  </View>

                  <View
                    className="h-3 bg-gray-300 rounded-full"
                    style={{ overflow: "hidden", width: "100%" }}
                  >
                    <View
                      className="h-3 bg-[#722F37] rounded-full"
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
