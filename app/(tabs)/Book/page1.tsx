import { useSignupStore } from "@/app/store/signup-store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page1() {
  const router = useRouter();
  const setBookName = useSignupStore((s) => s.setBookName);
  const setAuthor = useSignupStore((s) => s.setAuthor);
  const setTotalPages = useSignupStore((s) => s.setTotalPages);

  const [fields, setFields] = useState({
    bookName: "",
    authorName: "",
    numberOfPages: "",
  });

  const [errors, setErrors] = useState({
    bookName: "",
    authorName: "",
    numberOfPages: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNext = () => {
    const newErrors = {
      bookName: fields.bookName.trim() ? "" : "Please enter the book name",
      authorName: fields.authorName.trim()
        ? ""
        : "Please enter the author’s name",
      numberOfPages: fields.numberOfPages.trim()
        ? ""
        : "Please enter number of pages",
    };
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((e) => e !== "");
    if (!hasError) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Persist to store
        setBookName(fields.bookName.trim());
        setAuthor(fields.authorName.trim());
        setTotalPages(fields.numberOfPages.trim());
        router.push("/(tabs)/Book/page2");
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 20 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../../assets/images/book/arrow-left.png")}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Add</Text>
        </View>

        {/* Image */}
        <View className="items-center mb-6">
          <Image
            source={require("../../../assets/images/signup/monkey2.png")}
            className="w-64 h-64"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-semibold text-center mb-6 text-[#722F37]">
          Enter Book Details
        </Text>

        {/* Input Fields */}
        <View className="gap-4">
          <TextInput
            value={fields.bookName}
            onChangeText={(text) => handleChange("bookName", text)}
            onFocus={() => setFocusedField("bookName")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter Book Name"
            placeholderTextColor="#999"
            className="w-full py-4 px-4 rounded-lg border text-lg bg-white"
            style={{
              borderColor: focusedField === "bookName" ? "#722F37" : "#CCD1D3",
            }}
          />
          {errors.bookName ? (
            <Text className="text-red-500 text-sm">{errors.bookName}</Text>
          ) : null}

          <TextInput
            value={fields.authorName}
            onChangeText={(text) => handleChange("authorName", text)}
            onFocus={() => setFocusedField("authorName")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter Author’s Name"
            placeholderTextColor="#999"
            className="w-full py-4 px-4 rounded-lg border text-lg bg-white"
            style={{
              borderColor:
                focusedField === "authorName" ? "#722F37" : "#CCD1D3",
            }}
          />
          {errors.authorName ? (
            <Text className="text-red-500 text-sm">{errors.authorName}</Text>
          ) : null}

          <TextInput
            value={fields.numberOfPages}
            onChangeText={(text) => handleChange("numberOfPages", text)}
            onFocus={() => setFocusedField("numberOfPages")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter Number of Pages"
            keyboardType="numeric"
            placeholderTextColor="#999"
            className="w-full py-4 px-4 rounded-lg border text-lg bg-white"
            style={{
              borderColor:
                focusedField === "numberOfPages" ? "#722F37" : "#CCD1D3",
            }}
          />
          {errors.numberOfPages ? (
            <Text className="text-red-500 text-sm">{errors.numberOfPages}</Text>
          ) : null}
        </View>

        {/* Next Button */}
        <View className="mt-6">
          <TouchableOpacity
            onPress={handleNext}
            className="bg-[#722F37] w-full py-4 rounded-lg flex-row justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-center text-lg">
                Next
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
