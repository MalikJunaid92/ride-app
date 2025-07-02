import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import fonts from "@/themes/app.fonts";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import RNPickerSelect from "react-native-picker-select";
interface InputProps {
  title: string;
  placeholder: string;
  items: { label: string; value: string }[];
  value?: string;
  warning?: string;
  onValueChange: (value: string) => void;
  showWarning?: boolean;
}

export default function SelectInput({
  title,
  placeholder,
  items,
  value,
  warning,
  onValueChange,
  showWarning,
}: InputProps) {
  const { colors } = useTheme();
  return (
    <View>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        value={value}
        placeholder={{
          label: placeholder,
          value: null,
          color: "#9EA0A4",
        }}
        style={{
          inputIOS: {
            ...styles.input,
            backgroundColor: color.lightGray,
            borderColor: colors.border,
            height: windowHeight(39),
            justifyContent: "center",
            fontSize: windowWidth(16),
            paddingHorizontal: 10,
          },
          inputAndroid: {
            ...styles.input,
            backgroundColor: color.lightGray,
            borderColor: colors.border,
            height: windowHeight(39),
            color: "#000",
            fontSize: windowWidth(16),
            paddingHorizontal: 10,
          },
          placeholder: {
            color: "#9EA0A4",
            fontSize: windowWidth(16),
          },
        }}
        useNativeAndroidPickerStyle={false}
      />

      {showWarning && <Text style={[styles.warning]}>{warning}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.medium,
    fontSize: windowWidth(20),
    marginVertical: windowHeight(8),
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 5,
    height: windowHeight(30),
    color: color.secondaryFont,
    paddingHorizontal: 10,
  },
  warning: {
    color: color.red,
    marginTop: 3,
  },
});
