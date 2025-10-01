import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle as SvgCircle, G } from "react-native-svg";

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
  const router = useRouter();

  const progress = 0.7;
  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - circumference * progress;

  const angle = 2 * Math.PI * progress - Math.PI / 2;
  const iconRadius = radius;
  const endX = size / 2 + iconRadius * Math.cos(angle);
  const endY = size / 2 + iconRadius * Math.sin(angle);

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
      <View className="flex-row items-center justify-between mb-4 mt-10">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../assets/images/book/arrow-left.png")}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Add a Book</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/shelf/menu2.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View className="items-center mt-10 mb-8">
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <SvgCircle
              stroke="#E5E5E5"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
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
        </Svg>

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 36, fontWeight: "bold", color: "#141414" }}>
            {Math.round(progress * 100)}%
          </Text>
          <Text style={{ fontSize: 20, color: "#555" }}>Completed</Text>
        </View>
      </View>

      <Text className="text-2xl font-semibold text-center mb-2">
        Harry Potter and the Philosopher&apos;s Stone
      </Text>
      <Text className="text-center text-[#A1A1A1] mb-4">By J. K. Rowling</Text>

      <View className="flex-row justify-center items-center p-4 mb-4">
        <View className="items-center flex-1">
          <Text className="text-2xl">210</Text>
          <Text className="font-semibold text-[#141414] text-lg">
            Total Pages
          </Text>
        </View>
        <View className="h-20 w-px bg-gray-200" />
        <View className="items-center flex-1">
          <Text className="text-2xl">300</Text>
          <Text className="font-semibold text-[#141414] text-lg">
            Completed
          </Text>
        </View>
        <View className="h-20 w-px bg-gray-200" />
        <View className="items-center flex-1">
          <Text className="text-2xl">5</Text>
          <Text className="font-semibold text-[#141414] text-lg">
            Pages Left
          </Text>
        </View>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={require("../../assets/images/book/clock.png")}
            className="w-5 h-5 mr-2"
            resizeMode="contain"
          />
          <Text className="text-[#141414] text-lg">
            At your pace, you’ll finish in 30 days
          </Text>
        </View>
        <View className="flex-row items-center">
          <Image
            source={require("../../assets/images/book/calendar.png")}
            className="w-5 h-5 mr-2"
            resizeMode="contain"
          />
          <Text className="text-[#141414] text-lg">
            Completion Date: Nov 30, 2025
          </Text>
        </View>
      </View>

      <View className="border-t border-gray-200 my-4" />

      <View className="flex-row justify-between items-center mb-2 mt-4">
        <Text className="text-2xl font-semibold text-[#141414]">
          Your Reading Plan
        </Text>
        <TouchableOpacity>
          <Text className="text-[#722F37] font-bold underline">Edit Plan</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center mb-4">
        <Text className="font-semibold text-[#141414] mr-2 text-lg">
          Today:
        </Text>
        <Text className="text-[#141414] text-lg">{formattedDate}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekData.map((day, idx) => {
          const isToday = day.day === "Wed";
          return (
            <View
              key={idx}
              style={{ alignItems: "center", marginRight: 8, width: 55 }}
            >
              <View
                style={{
                  height: 100,
                  width: 50,
                  borderWidth: 1,
                  borderColor: "#EFDFBB",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "#555", fontSize: 16, fontWeight: "bold" }}
                  >
                    -
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1.2,
                    backgroundColor: "#FDF6E7",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                >
                  <Text style={{ color: "#555", fontWeight: "600" }}>
                    {day.day}
                  </Text>
                </View>
              </View>

              {isToday && (
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: "#722F37",
                    marginTop: 6,
                  }}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}
