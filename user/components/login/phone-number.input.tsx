import { View, Text, TextInput } from "react-native";
import { commonStyles } from "@/styles/common.style";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { external } from "@/styles/external.style";
import color from "@/themes/app.colors";
import styles from "@/screens/login/styles";
import SelectInput from "../common/select-input";
import { useState } from "react";
import { countryItems } from "@/configs/country-list";
interface Props {
  width?: number;
  phone_number: string;
  setphone_number: (phone_number: string) => void;
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
}

export default function PhoneNumberInput({ width,phone_number, setphone_number,countryCode, setCountryCode }: Props) {
  return (
    <View>
      <Text
        style={[commonStyles.mediumTextBlack, { marginTop: windowHeight(8) }]}
      >
        Phone Number
      </Text>
      <View
        style={[
          external.fd_row,
          external.ai_center,
          external.mt_5,
          { flexDirection: "row" },
        ]}
      >
        <View
          style={[
            styles.countryCodeContainer,
            {
              borderColor: color.border,
            },
          ]}
        >
          <SelectInput
            title="+92"
            placeholder="Select country code"
            value={countryCode}
            onValueChange={(value) => setCountryCode(value)}
            showWarning={false}
            warning={"Please select a valid country code"}
            items={countryItems}
          />
        </View>
        <View
          style={[
            styles.phoneNumberInput,
            {
              width: width || windowWidth(326),
              borderColor: color.border,
            },
          ]}
        >
          <TextInput
            style={[commonStyles.regularText]}
            placeholderTextColor={color.subtitle}
            placeholder={"Enter your number"}
            keyboardType="numeric"
            value={phone_number}
            onChangeText={setphone_number}
            maxLength={10}
          />
        </View>
      </View>
    </View>
  );
}
