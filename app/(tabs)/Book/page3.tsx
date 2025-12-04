import { useSignupStore } from "@/app/store/signup-store";
import { useUserStore } from "@/app/store/user-store";
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
import { BookService } from "../../../lib/books";
import { ReadingPlanService } from "../../../lib/reading-plans";
import { supabase } from "../../../lib/supabase";

export default function Page3() {
  const router = useRouter();

  const everydayPages = useSignupStore((s) => s.everydayPages);
  const setEverydayPages = useSignupStore((s) => s.setEverydayPages);
  const bookName = useSignupStore((s) => s.bookName);
  const author = useSignupStore((s) => s.author);
  const totalPages = useSignupStore((s) => s.totalPages);
  const user = useUserStore((s) => s.user);

  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
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
    if (!bookName.trim() || !author.trim() || !totalPages.trim()) {
      setError("Missing details from step 1. Please go back and fill them.");
      return;
    }
    if (!everydayPages.trim() || parseInt(everydayPages) <= 0) {
      setError("Please enter how many pages you can read every day.");
      return;
    }

    setError("");

    // Get user ID - try from store first, then from Supabase session
    let userId = user?.id;
    if (!userId) {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser?.id) {
          userId = currentUser.id;
          // Update the store with the current user
          useUserStore.getState().setUser(currentUser);
        } else {
          setError("You must be signed in to add a book. Please sign in and try again.");
          return;
        }
      } catch (err) {
        setError("Unable to verify your account. Please sign in and try again.");
        return;
      }
    }

    if (!userId) {
      setError("You must be signed in to add a book.");
      return;
    }

    setError("");
    setLoading(true);

    // Insert book, then link to user as currently_reading
    const { data: book, error } = await BookService.addBook({
      title: bookName,
      author,
      page_count: parseInt(totalPages, 10),
    });
    if (error || !book) {
      setError("Failed to add book. Please try again.");
      return;
    }
    const link = await BookService.addBookToUser(
      userId,
      book.id,
      "currently_reading"
    );
    if (link.error) {
      setError("Failed to add book to your shelf. Please try again.");
      return;
    }

      // Save everyday reading plan
      const planResult = await ReadingPlanService.createReadingPlan(
        userId,
        book.id,
        'everyday',
        parseInt(everydayPages, 10)
      );
      if (planResult.error) {
        // Log error but don't block navigation - plan creation is optional
        console.error("Failed to save reading plan:", planResult.error);
      }

    router.push("/(tabs)/book/book-added");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center mb-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                source={require("../../../assets/images/book/arrow-left.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text className="text-xl font-semibold ml-3">Add a Book</Text>
          </View>

          <View className="items-center mb-4 mt-4">
            <Image
              source={require("../../../assets/images/signup/monkey1.png")}
              className="w-64 h-64"
              resizeMode="contain"
            />
          </View>

          <Text className="text-3xl font-semibold text-[#722F37] mb-6 text-center">
            How many pages you can read Everyday
          </Text>

          <View className="flex-row items-center mb-2 justify-center">
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
              className="border p-5 w-56 text-center rounded-lg bg-white"
              style={{
                borderColor: focused ? "#722F37" : "#D1D5DB",
                borderWidth: 1,
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
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

          <View className="mt-6 mb-10">
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-[#722F37] w-full py-4 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-center text-lg">
                  Add a Book
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
