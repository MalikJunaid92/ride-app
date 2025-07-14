import {
  View,
  Text,
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
} from "react-native";
import React from "react";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import fonts from "@/themes/app.fonts";
import color from "@/themes/app.colors";
import { useTheme } from "@react-navigation/native";
interface InputProps {
  title: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  value?: string;
  warning?: string;
  onChangeText?: (text: string) => void;
  showWarning?: boolean;
  emailFormatWarning?: string;
  disabled?: boolean;
}

const Input = ({
  title,
  placeholder,
  keyboardType,
  value,
  warning,
  onChangeText,
  showWarning,
  emailFormatWarning,
  disabled,
}: InputProps) => {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: color.lightGray,
            borderColor: colors.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={color.secondaryFont}
        keyboardType={keyboardType}
        value={value}
        aria-disabled={disabled}
        onChangeText={onChangeText}
      />
      {showWarning && <Text style={[styles.warning]}>{warning}</Text>}
    </View>
  );
};

export default Input;

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
