import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function MyPalsIndex() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/(tabs)/my-pals/pals-page");
  }, []);
  
  return null;
}

