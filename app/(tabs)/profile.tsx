import { View, Text } from "react-native";

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile Page</Text>
      <Text>Manage your profile here.</Text>
    </View>
  );
}
