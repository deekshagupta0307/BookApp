import { useRouter } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "./progress-bar";
import BookDetailsForm from "./ui/book-details-form";

export default function Signup1() {
  const router = useRouter();

  const handleNext = () => {
    router.push("./4");
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
            padding: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center w-full">
            <ProgressBar step={1} totalSteps={2} />

            <Image
              source={require("../../assets/images/signup/monkey1.png")}
              className="w-64 h-64 mb-8 mt-6"
              resizeMode="contain"
            />

            <Text className="text-3xl font-semibold text-[#722F37] mb-6 text-center">
              Enter Book Details
            </Text>

            <BookDetailsForm onNext={handleNext} />
          </View>

          <View className="mt-6 items-center">
            <TouchableOpacity onPress={() => router.push("/components/buddy-page")}>
              <Text className="text-[#722F37] font-semibold">Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
