import React from "react";
import type { FC, ComponentProps } from "react";
import { StyleSheet, Text as RNText } from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "../constants/Colors";
export type TextProps = {
	bold?: boolean;
} & ComponentProps<typeof RNText>;

export const Text: FC<TextProps> = ({ bold = false, style, ...props }) => {
	return (
		<RNText
			style={[
				styles.text,
				{
					fontFamily: bold ? "NanumSquareBold" : "NanumSquareRound"
				},
				style
			]}
			{...props}
		/>
	);
};

const styles = StyleSheet.create({
	underline: { textDecorationLine: "underline" },
	text: {
		fontFamily: "NanumSquareRound",
		color: Colors.dark.white
	}
});
