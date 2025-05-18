import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#18f",
            headerTitle: "SEMAPA",
          }}
        />
      </View>
      <Toast />
    </SafeAreaProvider>
  );
}
