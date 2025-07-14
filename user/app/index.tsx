import { Redirect } from "expo-router";
import { useState } from "react";

export default function index() {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  return (
    <Redirect href={!isloggedIn ? "/(routes)/onboarding " : "/(tabs)/home"} />
  );
}
