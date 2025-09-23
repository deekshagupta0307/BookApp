import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupMain() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const nextPage = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    router.push('./1'); // relative path to first question page
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-6">Sign Up</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} className="border p-3 mb-4 rounded" />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} className="border p-3 mb-4 rounded" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry className="border p-3 mb-4 rounded" />
      <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry className="border p-3 mb-6 rounded" />
      <TouchableOpacity onPress={nextPage} className="bg-blue-500 px-6 py-3 rounded items-center">
        <Text className="text-white font-bold">Next</Text>
      </TouchableOpacity>
    </View>
  );
}
