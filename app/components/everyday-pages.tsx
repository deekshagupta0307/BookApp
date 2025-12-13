import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookService } from "../../lib/books";
import { ReadingPlanService } from "../../lib/reading-plans";
import { supabase } from "../../lib/supabase";
import { useSignupStore } from "../store/signup-store";
import { useUserStore } from "../store/user-store";
import ProgressBar from "./progress-bar";

export default function EverydayPages() {
  const router = useRouter();
  const everydayPages = useSignupStore((s) => s.everydayPages);
  const setEverydayPages = useSignupStore((s) => s.setEverydayPages);

  // Book details from store
  const bookName = useSignupStore((s) => s.bookName);
  const author = useSignupStore((s) => s.author);
  const totalPages = useSignupStore((s) => s.totalPages);

  const user = useUserStore((s) => s.user);

  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const increment = () => {
    let num = parseInt(everydayPages) || 0;
    if (num < 99) num += 1;
    setEverydayPages(num.toString());
    setError("");
  };

  const decrement = () => {
    let num = parseInt(everydayPages) || 0;
    if (num > 0) num -= 1;
    setEverydayPages(num.toString());
    setError("");
  };

  const handleChange = (text: string) => {
    let num = text.replace(/[^0-9]/g, "");
    if (num.length > 2) num = num.slice(0, 2);
    setEverydayPages(num);
    setError("");
  };

  const handleSubmit = async () => {
    if (!everydayPages.trim() || parseInt(everydayPages) <= 0) {
      setError("Please enter how many pages you can read every day.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 1. Get User ID
      let userId = user?.id;
      if (!userId) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser?.id) {
          userId = currentUser.id;
        } else {
          setError("You must be signed in to add a book.");
          setLoading(false);
          return;
        }
      }

      // 2. Add Book to Database
      const { data: book, error: bookError } = await BookService.addBook({
        title: bookName,
        author: author,
        page_count: parseInt(totalPages, 10),
      });

      if (bookError || !book) {
        console.error("Error adding book:", bookError);
        setError("Failed to save book details. Please try again.");
        setLoading(false);
        return;
      }

      // 3. Link Book to User
      const { error: linkError } = await BookService.addBookToUser(
        userId,
        book.id,
        "currently_reading"
      );

      if (linkError) {
        console.error("Error linking book:", linkError);
        setError("Failed to add book to your library.");
        setLoading(false);
        return;
      }

      // 4. Create Reading Plan (Daily)
      const { error: planError } = await ReadingPlanService.createReadingPlan(
        userId,
        book.id,
        "everyday",
        parseInt(everydayPages, 10)
      );

      if (planError) {
        console.error("Error creating plan:", planError);
        // We continue even if plan fails, but maybe warn user? 
        // For now, just continue as the book is added.
      }

      setLoading(false);
      router.push("./success-signup");

    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFBF2" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            padding: 10,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center">
            <ProgressBar step={3} totalSteps={4} />

            <Image
              source={require("../../assets/images/signup/monkey2.png")}
              className="w-72 h-72 mb-8 mt-6"
              resizeMode="contain"
            />

            <Text className="text-4xl font-semibold text-[#722F37] mb-6 text-center">
              How many pages you can read Everyday
            </Text>

            <View className="flex-row items-center mb-2">
              <TouchableOpacity
                onPress={decrement}
                className="w-14 h-14 rounded-md items-center justify-center mr-4"
                style={{ backgroundColor: "#722F37" }}
              >
                <Text className="text-2xl text-white font-bold">-</Text>
              </TouchableOpacity>

              <TextInput
                value={everydayPages}
                onChangeText={handleChange}
                keyboardType="numeric"
                placeholder="Pages Everyday"
                placeholderTextColor="#999"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  borderWidth: 1,
                  borderColor: isFocused ? "#722F37" : "#E7E7E7",
                  padding: 20,
                  width: 110,
                  textAlign: "center",
                  borderRadius: 12,
                  backgroundColor: "#fff",
                }}
              />

              <TouchableOpacity
                onPress={increment}
                className="w-14 h-14 rounded-md items-center justify-center ml-4"
                style={{ backgroundColor: "#722F37" }}
              >
                <Text className="text-2xl text-white font-bold">+</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <Text className="text-red-500 text-sm mb-4 text-center">
                {error}
              </Text>
            ) : null}
          </View>

          <View className="flex-row justify-between w-full mb-10 px-4">
            <View
              className="w-20 h-20 rounded-full border-2 items-center justify-center"
              style={{ borderColor: "#EFDFBB" }}
            >
              <TouchableOpacity
                onPress={() => router.push("./4")}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: "#EFDFBB" }}
              >
                <Text className="text-2xl text-[#722F37] font-extrabold">
                  ←
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className="w-20 h-20 rounded-full border-2 items-center justify-center"
              style={{ borderColor: "#722F37" }}
            >
              <TouchableOpacity
                onPress={handleSubmit}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: "#722F37" }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-2xl text-white font-extrabold">→</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
