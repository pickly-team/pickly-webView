import React from "react";
import type { ComponentProps } from "react";
import { TouchableOpacity, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

type TouchableOpacityProps = ComponentProps<typeof TouchableOpacity>;
export type TouchableViewProps = TouchableOpacityProps & {
	viewStyle?: StyleProp<ViewStyle>;
};
const Button = ({
	children,
	viewStyle,
	...touchableProps
}: TouchableViewProps) => {
	return (
		<TouchableOpacity style={{ height: 50 }} {...touchableProps}>
			<View style={[viewStyle]}>{children}</View>
		</TouchableOpacity>
	);
};

export default Button;
