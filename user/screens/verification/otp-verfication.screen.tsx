import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight } from "@/themes/app.constant";
import SignInText from "@/components/login/signin.text";
import OTPTextInput from "react-native-otp-textinput";
import { style } from "./style";
import color from "@/themes/app.colors";
import { external } from "@/styles/external.style";
import Button from "@/components/common/button";
import { router, useLocalSearchParams } from "expo-router";
import { commonStyles } from "@/styles/common.style";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const OtpVerficationScreen = () => {
  const [otp, setOtp] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const toast = useToast();
  const { phoneNumber } = useLocalSearchParams();
  const handleSubmit = async () => {
    if (otp === "") {
      toast.show("please fill the fields!", {
        placement: "bottom",
      });
    } else {
      setLoader(true);
      const otpNumber = `${otp}`;
      console.log(otpNumber, phoneNumber);
      await axios
        .post(`http://10.0.2.2:8000/api/v1/verify-otp`, {
          phone_number: phoneNumber,
          otp: otpNumber,
        })
        .then(async (res) => {
          setLoader(false);
          console.log(res.data);
          if (res.data.user.email === null) {
            router.push({
              pathname: "/(routes)/registration",
              params: {
                user: JSON.stringify(res.data.user),
              },
            });
            toast.show("Account Verified!");
          } else {
            await AsyncStorage.setItem("accessToken", res.data.accessToken);
            router.push("/(tabs)/home");
          }
        })
        .catch((error) => {
          setLoader(false);
          toast.show("Something went wrong! Please re-check your OTP!.", {
            type: "danger",
            placement: "bottom",
          });
        });
    }
  };
  return (
    <AuthContainer
      topSpace={windowHeight(240)}
      imageShow={true}
      container={
        <View>
          <SignInText
            title={"Otp Verification"}
            subtitle={"Check you phone number for the otp!"}
          />
          <OTPTextInput
            handleTextChange={(text) => setOtp(text)}
            inputCount={4}
            textInputStyle={style.otpTextInput}
            tintColor={color.subtitle}
            autoFocus={false}
          />
          <View style={[external.mt_30]}>
            <Button
              title={"Verify"}
              onPress={() => handleSubmit()}
              disabled={loader}
            />
          </View>
          <View style={[external.mb_15]}>
            <View
              style={[
                external.pt_10,
                external.Pb_10,
                { flexDirection: "row", gap: 5, justifyContent: "center" },
              ]}
            >
              <Text style={commonStyles.regularText}>Not Received yet?</Text>
              <TouchableOpacity>
                <Text style={[style.signUpText, { color: "#000" }]}>
                  Resend it
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
};

export default OtpVerficationScreen;
