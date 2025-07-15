import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import Button from "@/components/common/button";
import TitleView from "@/components/signup/title.view";
import Input from "@/components/common/input";
import color from "@/themes/app.colors";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
const RegistrationScreen = () => {
  const { colors } = useTheme();
  const { user } = useLocalSearchParams() as any;
  const parsedUser = JSON.parse(user);
  const [emailFormatWarning, setEmailFormatWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .post(`http://10.0.2.2:8000/api/v1/email-otp-request`, {
        email: formData.email,
        name: formData.name,
        userId: parsedUser.id,
      })
      .then(async (res: any) => {
        setLoading(false);
        const userData: any = {
          id: parsedUser.id,
          name: formData.name,
          email: formData.email,
          phone_number: parsedUser.phone_number,
          token: res.data.token,
        };
        router.push({
          pathname: "/(routes)/email-verification",
          params: { user: JSON.stringify(userData) },
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <ScrollView>
      <View>
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: windowWidth(30),
            textAlign: "center",
            paddingTop: windowHeight(50),
          }}
        >
          RideWave
        </Text>
        <View style={{ padding: windowWidth(20) }}>
          <View
            style={[styles.subView, { backgroundColor: colors.background }]}
          >
            <View style={styles.space}>
              <TitleView
                title={"Create your account"}
                subTitle="Explore your life by joining Ride Wave"
              />
              <Input
                title="Name"
                placeholder="Enter your name"
                value={formData?.name}
                onChangeText={(text) => handleChange("name", text)}
                showWarning={showWarning && formData.name === ""}
                warning={"Please enter your name!"}
              />
              <Input
                title="Phone Number"
                placeholder="Enter your phone number"
                value={parsedUser?.phone_number}
                disabled={true}
              />
              <Input
                title="Email Address"
                placeholder="Enter your email address"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                showWarning={
                  (showWarning && formData.name === "") ||
                  emailFormatWarning !== ""
                }
                warning={
                  emailFormatWarning !== ""
                    ? "Please enter your email!"
                    : "Please enter a validate email!"
                }
                emailFormatWarning={emailFormatWarning}
              />
              <View style={styles.margin}>
                <Button
                  onPress={() => handleSubmit()}
                  title="Next"
                  disabled={loading}
                  backgroundColor={color.buttonBg}
                  textColor={color.whiteColor}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegistrationScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  subView: {
    height: "100%",
  },
  space: {
    marginHorizontal: windowWidth(4),
  },
  margin: {
    marginVertical: windowHeight(12),
  },
});
