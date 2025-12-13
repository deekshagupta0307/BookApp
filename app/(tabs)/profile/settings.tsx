import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { useUserStore } from "../../store/user-store";

export default function Settings() {
  const router = useRouter();
  const { user } = useUserStore();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, email, avatar_url")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        if (data) {
          // Show first_name in username as requested since no username column exists
          setUsername(data.first_name || "");
          setFullName(`${data.first_name} ${data.last_name}`.trim());
          setEmail(data.email || user?.email || "");
          setAvatarUrl(data.avatar_url);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        setAvatarUrl(image.uri); // Optimistic update
        uploadAvatar(image.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: blob.type || 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (data) {
        const publicUrl = data.publicUrl;

        // Update user profile with new avatar URL
        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: publicUrl })
          .eq('id', user?.id);

        if (updateError) throw updateError;

        setAvatarUrl(publicUrl);
        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Error", "Failed to upload profile picture");
      // Revert optimistic update if needed, fetching profile again
      fetchProfile();
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const names = fullName.split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";

      // 1. Update public.users table
      const { error: dbError } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          // username column doesn't exist
          // email update usually handled separately due to auth confirmation
        })
        .eq("id", user.id);

      if (dbError) throw dbError;

      // 2. Update auth metadata (optional but good for consistency)
      const { error: authError } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName }
      });

      if (authError) throw authError;

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      Alert.alert("Success", "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white p-4 pt-14 pb-10"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.push("/profile/my-profile")}>
          <Image
            source={require("../../../assets/images/book/arrow-left.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text className="text-[22px] font-semibold ml-3">
          Edit Profile Settings
        </Text>
      </View>

      <View className="items-center mb-6">
        <View className="relative">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <Image
              source={require("../../../assets/images/profile/user.png")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          )}

          {uploading && (
            <View className="absolute inset-0 justify-center items-center bg-black/30 rounded-full">
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </View>

        <TouchableOpacity onPress={pickImage} disabled={uploading}>
          <Text className="text-[#722F37] underline mt-2 font-semibold">
            {uploading ? "Uploading..." : "Edit Profile Picture"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-3 flex-row items-center">
        <TextInput
          placeholder="Username"
          className="flex-1"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-3 flex-row items-center">
        <TextInput
          placeholder="Full Name"
          className="flex-1"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-4 flex-row items-center opacity-50">
        <TextInput
          placeholder="Email Address"
          className="flex-1 text-gray-500"
          keyboardType="email-address"
          value={email}
          editable={false}
        />
      </View>

      <TouchableOpacity
        className="bg-[#722F37] py-4 rounded-xl mb-8"
        onPress={handleSaveProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Save Changes
          </Text>
        )}
      </TouchableOpacity>

      <Text className="text-lg font-semibold mb-4">Reset Password</Text>

      {/* Current password field removed as Supabase doesn't require it for update if session is active, 
          but usually good practice. For now keeping it simple per requirement */ }

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-3 flex-row items-center">
        <TextInput
          placeholder="Enter New Password"
          secureTextEntry
          className="flex-1"
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <View className="border border-[#CCCCCC] rounded-lg p-3 mb-8 flex-row items-center">
        <TextInput
          placeholder="Re-enter New Password"
          secureTextEntry
          className="flex-1"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity
        className="bg-[#722F37] py-4 rounded-xl mb-8"
        onPress={handlePasswordChange}
        disabled={passwordLoading}
      >
        {passwordLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Update Password
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
