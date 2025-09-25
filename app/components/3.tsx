import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import ProgressBar from "./progress-bar";
import { useSignupStore } from "../store/signup-store";

export default function Signup3() {
  const router = useRouter();
  const { totalPages, setTotalPages } = useSignupStore();

  const handleNext = () => {
    if (!totalPages.trim()) {
      Alert.alert("Error", "Please enter total pages.");
      return;
    }
    router.push("./4");
  };

  return (
    <View className="flex-1 bg-[#FFFBF2] p-6">
      <ProgressBar step={3} totalSteps={4} />

      <View className="flex-1 justify-center items-center">
        <Image source={require("../../assets/images/signup/monkey1.png")} className="w-72 h-72 mb-8" resizeMode="contain" />

        <Text className="text-4xl font-semibold text-[#722F37] mb-6 text-center">
          How many pages does this book have?
        </Text>

        <TextInput
          value={totalPages}
          onChangeText={setTotalPages}
          placeholder="Enter Number of Pages"
          keyboardType="numeric"
          className="border border-gray-300 p-5 w-full rounded-lg bg-white mb-6"
        />
      </View>

      <View className="flex-row justify-between w-full mb-10">
        <View className="w-20 h-20 rounded-full border-2 items-center justify-center" style={{ borderColor: "#EFDFBB" }}>
          <TouchableOpacity onPress={() => router.push("./2")} className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: "#EFDFBB" }}>
            <Text className="text-2xl text-[#722F37] font-extrabold">←</Text>
          </TouchableOpacity>
        </View>

        <View className="w-20 h-20 rounded-full border-2 items-center justify-center" style={{ borderColor: "#722F37" }}>
          <TouchableOpacity onPress={handleNext} className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: "#722F37" }}>
            <Text className="text-2xl text-white font-extrabold">→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
