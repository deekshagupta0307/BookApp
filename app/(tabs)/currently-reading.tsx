import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Circle } from "react-native-progress"; // npm i react-native-progress
const { width } = Dimensions.get("window");

const weekData = [
  { day: "Mon", date: "1" },
  { day: "Tue", date: "2" },
  { day: "Wed", date: "3" },
  { day: "Thu", date: "4" },
  { day: "Fri", date: "5" },
  { day: "Sat", date: "6" },
  { day: "Sun", date: "7" },
];

export default function CurrentlyReading() {
  const progress = 0.7;
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 16,
      }}
    >
      {/* Top Card */}
      <View className="flex-row items-center bg-[#FDF6E7] px-4 py-2 rounded-lg mt-8">
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

      {/* Circular Progress */}
      <View className="items-center mt-10 mb-6">
        <Circle
          size={180}
          progress={progress}
          showsText={true}
          formatText={() => `${Math.round(progress * 100)}%`}
          color="#722F37"
          thickness={10}
          unfilledColor="#E5E5E5"
          textStyle={{ fontSize: 18, fontWeight: "bold", color: "#722F37" }}
        />
      </View>

      {/* Book Image */}
      <View className="items-center mb-4">
        <Image
          source={require("../../assets/images/home/book.png")}
          className="w-10 h-10"
          resizeMode="contain"
        />
      </View>

      {/* Book Title & Author */}
      <Text className="text-2xl font-semibold text-center mb-1">
        Harry Potter and the Philosopher's Stone
      </Text>
      <Text className="text-center text-gray-600 mb-4">By J. K. Rowling</Text>

      {/* Three columns */}
      <View className="flex-row justify-around border rounded-lg p-4 mb-4">
        <View className="items-center flex-1">
          <Text className="font-bold text-[#722F37]">Pages Read</Text>
          <Text>210</Text>
        </View>
        <View className="h-full w-px bg-gray-300" />
        <View className="items-center flex-1">
          <Text className="font-bold text-[#722F37]">Total Pages</Text>
          <Text>300</Text>
        </View>
        <View className="h-full w-px bg-gray-300" />
        <View className="items-center flex-1">
          <Text className="font-bold text-[#722F37]">Days Left</Text>
          <Text>5</Text>
        </View>
      </View>

      {/* Two List Items */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">• Start Chapter 5</Text>
        <Text className="text-gray-700">• Review Notes from Chapter 4</Text>
      </View>

      {/* Horizontal Line */}
      <View className="border-t border-gray-300 my-4" />

      {/* Heading + Edit Plan */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-[#722F37]">Reading Plan</Text>
        <TouchableOpacity>
          <Text className="text-[#4DAC96] font-semibold">Edit Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Date */}
      <Text className="text-gray-600 mb-4">{formattedDate}</Text>

      {/* Week Days / Vertical Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekData.map((day, idx) => (
          <View
            key={idx}
            className="bg-[#FDF6E7] p-4 mr-4 rounded-lg shadow items-center"
            style={{ width: 80 }}
          >
            <Text className="font-bold text-[#722F37]">{day.day}</Text>
            <Text className="text-gray-700">{day.date}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
