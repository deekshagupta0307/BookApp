import { useRouter } from "expo-router"; // import router
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStore } from "../store/user-store";

const { width } = Dimensions.get("window");

const verticalCardsData = [
  {
    id: "1",
    title: "Harry Potter and the Philosopher's Stone",
    text: "By J. K. Rowling",
    progress: 0.7,
  },
  {
    id: "2",
    title: "Harry Potter and the Chamber of Secrets",
    text: "By J. K. Rowling",
    progress: 0.4,
  },
  {
    id: "3",
    title: "Harry Potter and the Prisoner of Azkaban",
    text: "By J. K. Rowling",
    progress: 0.9,
  },
  {
    id: "4",
    title: "Harry Potter and the Goblet of Fire",
    text: "By J. K. Rowling",
    progress: 0.2,
  },
  {
    id: "5",
    title: "Harry Potter and the Order of the Phoenix",
    text: "By J. K. Rowling",
    progress: 0.5,
  },
];

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState("today");
  const firstName = useUserStore((s) => s.firstName);
  const router = useRouter(); // initialize router
  const [buttonLoading, setButtonLoading] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const renderVerticalCards = () =>
    verticalCardsData.map((book) => (
      <TouchableOpacity
        key={book.id}
        onPress={() => router.push("/currently-reading")}
        className="flex-row border rounded-lg p-5 mb-4 border-[#EFDFBB] bg-white"
        style={{ minHeight: 120 }}
      >
        <Image
          source={require("../../assets/images/home/book.png")}
          className="w-10 h-10 mr-4"
          resizeMode="contain"
        />
        <View className="flex-1 justify-center">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-[#141414] font-semibold text-lg"
          >
            {book.title}
          </Text>

          <Text
            className="text-[#141414] mb-4"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {book.text}
          </Text>

          <View className="flex-row justify-between mb-1">
            <Text className="text-[#141414] text-sm">
              <Text className="font-bold">Completed: </Text>
              {Math.round(book.progress * 100)}%
            </Text>
            <Text className="text-[#141414] text-sm">
              <Text className="font-bold">Total Pages: </Text>300
            </Text>
          </View>

          <View
            className="h-3 bg-gray-300 rounded-full"
            style={{ overflow: "hidden", width: "100%" }}
          >
            <View
              className="h-3 bg-[#722F37] rounded-full"
              style={{ width: `${book.progress * 100}%` }}
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
    ));

  const handleAddBookPress = () => {
    setButtonLoading(true);
    // Optional: small delay so spinner is visible
    setTimeout(() => {
      router.push("/(tabs)/Book/page1");
    }, 500);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FFFFFF" }}
    >
      <View className="bg-[#722F37] p-6">
        <View className="flex-row items-center bg-[#FDF6E7] px-4 py-2 rounded-lg mt-12">
          <Image
            source={require("../../assets/images/home/logo.png")}
            className="w-8 h-8 ml-2"
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/images/home/pagepal.png")}
            className="w-20 ml-2"
            resizeMode="contain"
          />
          <View className="flex-1" />
          <Image
            source={require("../../assets/images/home/menu.png")}
            className="w-7 h-7 mr-2"
            resizeMode="contain"
          />
        </View>

        <View className="flex-row mt-4 justify-between items-center">
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

      <View className="px-6 mt-4">
        <Text className="text-[#141414] text-base">
          <Text className="font-bold">Today: </Text>
          {formattedDate}
        </Text>
      </View>

      <View className="flex-row justify-between mb-4 p-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["today", "reading", "finished"].map((tab) => {
            let title = "";
            let desc = "";
            if (tab === "today") {
              title = "Read Today";
              desc = "0 Page(s)";
            }
            if (tab === "reading") {
              title = "Currently Reading";
              desc = "0 Book(s)";
            }
            if (tab === "finished") {
              title = "Finished Reading";
              desc = "0 Book(s)";
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

      {selectedTab === "today" && (
        <View className="items-center p-6">
          <Image
            source={require("../../assets/images/signup/monkey4.png")}
            className="w-48 h-48 mb-4"
            resizeMode="contain"
          />
          <Text className="text-2xl font-medium text-center mb-2">
            Start Your Reading Journey
          </Text>
          <Text className="text-[#141414] text-center mb-4 px-4 text-lg">
            Add a Book to Get Started
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
      )}

      {selectedTab === "reading" && (
        <View className="px-6">
          <Text className="text-2xl font-bold mb-4">Currently Reading</Text>
          {renderVerticalCards()}
        </View>
      )}

      {selectedTab === "finished" && (
        <View className="px-6">
          <Text className="text-xl font-bold mb-4">Finished Books</Text>
          <Text className="text-gray-600 mb-2">
            Here are the books you’ve completed reading.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
