import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight } from "@/themes/app.constant";
import styles from "./styles";
import Images from "@/utils/images";
import SignInText from "@/components/login/signin.text";
import { external } from "@/styles/external.style";
import PhoneNumberInput from "@/components/login/phone-number.input";
import Button from "@/components/common/button";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import { router } from "expo-router";

export default function LoginScreen() {
  const [phone_number, setphone_number] = React.useState("");
  const [loading, setloading] = useState(false);
  const [countryCode, setCountryCode] = React.useState("92");

  const toast = useToast();
  const handleSubmit = async () => {
    if (phone_number === "" || countryCode === "") {
      toast.show("please fill the fields!", {
        placement: "bottom",
      });
    } else {
      setloading(true);
      const phoneNumber = `+${countryCode}${phone_number}`;

      await axios
        .post(`http://10.0.2.2:8000/api/v1/registeration`, {
          phone_number: phoneNumber,
        })
        .then((res) => {
          setloading(false);
          router.push({
            pathname: "/(routes)/otp-verification",
            params: { phoneNumber },
          });
        })
        .catch((error) => {
          setloading(false);
          toast.show(
            "Something went wrong! Please re-check your phone number.",
            {
              type: "danger",
              placement: "bottom",
            }
          );
        });
    }
  };
  return (
    <AuthContainer
      topSpace={windowHeight(150)}
      imageShow={true}
      container={
        <View>
          <View>
            <View>
              <Image style={styles.transformLine} source={Images.line} />
              <SignInText />
              <View style={[external.mt_25, external.p_10]}>
                <PhoneNumberInput
                  phone_number={phone_number}
                  setphone_number={setphone_number}
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                />
                <View style={[external.mt_25, external.Pb_15]}>
                  <Button
                    title="Get Otp"
                    onPress={() => handleSubmit()}
                    disabled={loading}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      }
    />
  );
}
