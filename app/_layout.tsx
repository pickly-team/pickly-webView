import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "react-native";
import useSettingFont from "../common/hooks/useSettingFont";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "login"
};

export default function RootLayout() {
	const { loaded } = useSettingFont();

	return (
		<>
			{/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
			{!loaded && <SplashScreen />}
			{loaded && <RootLayoutNav />}
		</>
	);
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack initialRouteName='index'>
					<Stack.Screen name='index' options={{ headerShown: false }} />
					<Stack.Screen name='modal' options={{ presentation: "modal" }} />
				</Stack>
			</ThemeProvider>
		</>
	);
}
