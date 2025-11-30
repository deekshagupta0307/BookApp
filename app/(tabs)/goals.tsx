import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const filteredBooks = [
  {
    id: 1,
    progress: 40,
    book: {
      title: "You are Dedicated Reader!",
      author: "Read 20 Pages Today",
      page_count: 142,
      cover_url: null,
    },
  },
  {
    id: 2,
    progress: 75,
    book: {
      title: "I’m a Reading Insect!",
      author: "Add a new book",
      page_count: 210,
      cover_url: null,
    },
  },
];

export default function Goals() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="w-full h-24 bg-[#722F37] flex-row items-center justify-between px-5 mt-6">
          <Text className="text-white text-2xl font-bold">My Goals</Text>
        </View>

        <View className="bg-white px-5 mt-8">
          <Text className="text-2xl font-bold">Hi Himanshu!</Text>

          <View className="flex-row justify-between items-center">
            <View className="w-[70%]">
              <Text className="text-base font-medium mb-8">
                You’re Currently at{" "}
                <Text className="font-bold text-base">Rookie Reader</Text>
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
            <Text className="text-xl font-semibold ">My Goals</Text>

            <TouchableOpacity className="flex-row items-center bg-[#FDF6E7] border border-[#EFDFBB] rounded-full px-4 py-2">
              <Image
                source={require("../../assets/images/goals/target.png")}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <Text className="text-base font-semibold">5</Text>
            </TouchableOpacity>
          </View>
          {filteredBooks.map((book) => (
            <View
              key={book.id}
              className="flex-row items-center mb-4"
              style={{ alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={() => {}}
                className="flex-1 flex-row border rounded-lg p-5 border-[#EFDFBB] bg-white"
                style={{ minHeight: 120 }}
              >
                {book.book?.cover_url ? (
                  <Image
                    source={{ uri: book.book.cover_url }}
                    className="w-10 h-10 mr-4"
                    resizeMode="contain"
                    style={{ borderRadius: 4 }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/goals/icon.png")}
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
                    {book.book?.title || "Unknown Book"}
                  </Text>

                  <Text
                    className="text-[#141414] mb-4"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    By {book.book?.author || "Unknown Author"}
                  </Text>

                  <View className="flex-row justify-between mb-1">
                    <Text className="text-[#141414] text-sm">
                      <Text className="font-bold">Completed: </Text>
                      {book.progress}%
                    </Text>
                    <Text className="text-[#141414] text-sm">
                      <Text className="font-bold">Total: </Text>
                      {book.book?.page_count || "N/A"}
                    </Text>
                  </View>

                  <View
                    className="h-3 bg-gray-300 rounded-full"
                    style={{ overflow: "hidden", width: "100%" }}
                  >
                    <View
                      className="h-3 bg-[#722F37] rounded-full"
                      style={{ width: `${Math.min(book.progress, 100)}%` }}
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
