import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGetUserData = () => {
  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getLoggedInUserData = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      await axios
        .get(`${process.env.EXPO_PUBLIC_SERVER_URI}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    };
    getLoggedInUserData();
  }, []);
  return { loading, user };
};

export default useGetUserData;
