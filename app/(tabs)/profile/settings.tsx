import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

export default function Settings() {
  const router = useRouter();
  const [dob, setDob] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER" | "">("");

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    setDob(date);
    hideDatePicker();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FDF6E7", padding: 20 }}>
      {/* Back Arrow and Heading */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          marginTop: 48,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/profile/my-profile")}>
          <Image
            source={require("../../../assets/images/book/arrow-left.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 12 }}>
          Settings
        </Text>
      </View>

      {/* Profile Icon with Edit */}
      <View style={{ alignSelf: "center", marginBottom: 48, marginTop: 16 }}>
        <Image
          source={require("../../../assets/images/profile/icon.png")}
          style={{ width: 100, height: 100, borderRadius: 50 }}
          resizeMode="contain"
        />
        <TouchableOpacity style={{ position: "absolute", bottom: 0, right: 0 }}>
          <Image
            source={require("../../../assets/images/profile/edit.png")}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Full Name Field */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Image
          source={require("../../../assets/images/profile/profile.png")}
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        <TextInput placeholder="Full Name" style={{ flex: 1 }} />
      </View>

      {/* Email Field */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Image
          source={require("../../../assets/images/profile/mail.png")}
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        <TextInput placeholder="Email" style={{ flex: 1 }} keyboardType="email-address" />
      </View>

      {/* Date of Birth */}
      <TouchableOpacity
        onPress={showDatePicker}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Image
          source={require("../../../assets/images/profile/calendar.png")}
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        <Text style={{ flex: 1, color: dob ? "#000" : "#888" }}>
          {dob ? dob.toDateString() : "Date of Birth"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />

      {/* Country + Mobile */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 8,
            justifyContent: "center",
          }}
        >
          <Picker
            selectedValue={countryCode}
            onValueChange={(itemValue) => setCountryCode(itemValue)}
            style={{ height: 48, width: "100%" }}
          >
            <Picker.Item label="+91" value="+91" />
            <Picker.Item label="+1" value="+1" />
            <Picker.Item label="+44" value="+44" />
          </Picker>
        </View>

        <TextInput
          placeholder="Mobile Number"
          style={{ flex: 2, backgroundColor: "#fff", padding: 12, borderRadius: 8 }}
          keyboardType="phone-pad"
        />
      </View>

      {/* Gender */}
      <View style={{ backgroundColor: "#fff", borderRadius: 8, marginBottom: 20 }}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={{ height: 48, width: "100%" }}
        >
          <Picker.Item label="Gender" value="" />
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>
      </View>
    </ScrollView>
  );
}
