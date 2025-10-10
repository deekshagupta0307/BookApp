import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useUserStore } from "../store/user-store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useUserStore((state) => state.initializeAuth);
  const isLoading = useUserStore((state) => state.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FFFBF2]">
        <ActivityIndicator size="large" color="#722F37" />
      </View>
    );
  }

  return <>{children}</>;
}
