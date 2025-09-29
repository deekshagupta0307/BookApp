import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Circle as SvgCircle, G, Path } from "react-native-svg"; // for custom progress
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
  const progress = 0.7; // 70%
  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - circumference * progress;

  // calculate end position of progress arc
  const angle = 2 * Math.PI * progress - Math.PI / 2; // start from top
  const endX = size / 2 + radius * Math.cos(angle);
  const endY = size / 2 + radius * Math.sin(angle);

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

      {/* Circular Progress with End Icon */}
      <View className="items-center mt-10 mb-6">
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background circle */}
            <SvgCircle
              stroke="#E5E5E5"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <SvgCircle
              stroke="#722F37"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
            />
          </G>
          {/* Center text */}
          <Text
            style={{
              position: "absolute",
              top: size / 2 - 10,
              left: size / 2 - 25,
              fontSize: 18,
              fontWeight: "bold",
              color: "#722F37",
            }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </Svg>
        <Image
          source={require("../../assets/images/book/progress.png")}
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            left: endX - 12,
            top: endY - 12,
          }}
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
        Harry Potter and the Philosopher&apos;s Stone
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

      {/* Two List Items with Icons */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("../../assets/images/book/clock.png")}
            className="w-4 h-4 mr-2"
            resizeMode="contain"
          />
          <Text className="text-gray-700">Start Chapter 5</Text>
        </View>
        <View className="flex-row items-center">
          <Image
            source={require("../../assets/images/book/calendar.png")}
            className="w-4 h-4 mr-2"
            resizeMode="contain"
          />
          <Text className="text-gray-700">Review Notes from Chapter 4</Text>
        </View>
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
