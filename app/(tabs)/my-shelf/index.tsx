import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function MyShelfIndex() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/(tabs)/my-shelf/reading-now");
  }, []);
  
  return null;
}

