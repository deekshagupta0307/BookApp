import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Signup5() {
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  const handleFinish = () => {
    router.replace("./home"); // Navigate to home page
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-xl mb-4">Question 5: What is your reading goal for this year?</Text>
      <TextInput
        value={answer}
        onChangeText={setAnswer}
        placeholder="Type your answer here"
        className="border p-3 w-full mb-4 rounded"
      />
      <TouchableOpacity
        onPress={handleFinish}
        className="bg-green-500 px-6 py-3 rounded"
      >
        <Text className="text-white font-bold">Finish</Text>
      </TouchableOpacity>
    </View>
  );
}
