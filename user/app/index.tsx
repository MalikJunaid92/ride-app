import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function index() {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error retrieving access token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);
  if (isLoading) {
    return null; // or a loading spinner
  }
  return (
    <Redirect href={!isloggedIn ? "/(routes)/onboarding " : "/(tabs)/home"} />
  );
}
