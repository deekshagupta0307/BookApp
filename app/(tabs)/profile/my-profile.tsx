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
import { supabase } from "../../../lib/supabase";
import { useUserStore } from "../../store/user-store";

const { width } = Dimensions.get("window");

export default function MyProfile() {
  const router = useRouter();
  const { user } = useUserStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const signOut = useUserStore((state) => state.signOut);
  
  // Profile data state
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null>(null);
  const [stats, setStats] = useState({
    booksRead: 0,
    pagesRead: 0,
    badges: 0,
    daysStreak: 0,
  });

  // Calculate reading streak (consecutive days with reading sessions)
  const calculateReadingStreak = (sessions: any[]): number => {
    if (!sessions || sessions.length === 0) return 0;

    // Get unique dates from sessions
    const uniqueDates = new Set(
      sessions.map(session => {
        const date = new Date(session.session_date);
        return date.toISOString().split('T')[0];
      })
    );

    const sortedDates = Array.from(uniqueDates).sort().reverse();
    if (sortedDates.length === 0) return 0;

    // Check if today or yesterday has a session
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

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
      const checkDateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(checkDateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Calculate badges based on milestones
  const calculateBadges = (booksRead: number, pagesRead: number): number => {
    let badgeCount = 0;

    // Book reading milestones
    if (booksRead >= 1) badgeCount++;
    if (booksRead >= 5) badgeCount++;
    if (booksRead >= 10) badgeCount++;
    if (booksRead >= 25) badgeCount++;
    if (booksRead >= 50) badgeCount++;
    if (booksRead >= 100) badgeCount++;

    // Page reading milestones
    if (pagesRead >= 100) badgeCount++;
    if (pagesRead >= 500) badgeCount++;
    if (pagesRead >= 1000) badgeCount++;
    if (pagesRead >= 5000) badgeCount++;
    if (pagesRead >= 10000) badgeCount++;

    return badgeCount;
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
          .from('users')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData) {
          setUserProfile(profileData);
        }

        // Fetch reading statistics
        const { data: readingStats, error: statsError } = 
          await BookService.getUserReadingStats(user.id);

        if (!statsError && readingStats) {
          setStats(prev => ({
            ...prev,
            booksRead: readingStats.totalBooksRead || 0,
            pagesRead: readingStats.totalPagesRead || 0,
          }));
        }

        // Calculate reading streak from reading sessions
        const { data: sessions, error: sessionsError } = 
          await BookService.getUserReadingSessions(user.id);

        if (!sessionsError && sessions) {
          const streak = calculateReadingStreak(sessions);
          setStats(prev => ({ ...prev, daysStreak: streak }));
        }

        // Calculate badges based on milestones
        const badges = calculateBadges(
          readingStats?.totalBooksRead || 0,
          readingStats?.totalPagesRead || 0
        );
        setStats(prev => ({ ...prev, badges }));

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  const handleMenuPress = (item: (typeof menuItems)[0]) => {
    if (item.navigateTo) {
      router.push(item.navigateTo);
    } else {
      setLogoutModalVisible(true);
    }
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await signOut();
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FDF6E7" }}>
        <ActivityIndicator size="large" color="#722F37" />
      </View>
    );
  }

  const displayName = userProfile 
    ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
    : user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`.trim()
    : user?.email?.split('@')[0] || "User";

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#FDF6E7" }}>
        {/* Top Background Section */}
        <View style={{ width: "100%", height: 300, position: "relative" }}>
          <Image
            source={require("../../../assets/images/profile/bg.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* Centered Icon/Avatar */}
          {userProfile?.avatar_url ? (
            <Image
              source={{ uri: userProfile.avatar_url }}
              style={{
                width: 80,
                height: 80,
                position: "absolute",
                top: 120,
                left: width / 2 - 40,
                borderRadius: 40,
              }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../../../assets/images/profile/icon.png")}
              style={{
                width: 80,
                height: 80,
                position: "absolute",
                top: 120,
                left: width / 2 - 40,
                borderRadius: 40,
              }}
              resizeMode="contain"
            />
          )}

          {/* Name below Icon */}
          <Text
            style={{
              position: "absolute",
              top: 210,
              width: "100%",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "600",
              color: "#FFFFFF",
            }}
          >
            {displayName}
          </Text>
          <Text className="text-md">1 Book(s)</Text>
        </View>

        {/* White Card */}
        <View
          style={{
            width: width * 0.8,
            backgroundColor: "#fff",
            alignSelf: "center",
            marginTop: -50,
            borderRadius: 20,
            padding: 16,
          }}
        >
          {/* Top Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <View style={{ alignItems: "flex-start" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginRight: 6 }}>{stats.booksRead}</Text>
                <Image
                  source={require("../../../assets/images/profile/icon1.png")}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ color: "#B5B6C4", marginTop: 4 }}>Books read</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginRight: 6 }}>{stats.pagesRead}</Text>
                <Image
                  source={require("../../../assets/images/profile/icon2.png")}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ color: "#B5B6C4", marginTop: 4 }}>Pages read</Text>
            </View>
          </View>

          {/* Bottom Row */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "flex-start" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginRight: 6 }}>
                  {stats.badges}
                </Text>
                <Image
                  source={require("../../../assets/images/profile/icon3.png")}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ color: "#B5B6C4", marginTop: 4 }}>Badges</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginRight: 6 }}>{stats.daysStreak}</Text>
                <Image
                  source={require("../../../assets/images/profile/icon4.png")}
                  style={{ width: 14, height: 14 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ color: "#B5B6C4", marginTop: 4 }}>
                Days Streak
              </Text>
            </View>
          </View>

          <ChevronRight size={20} color="#000" />
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
