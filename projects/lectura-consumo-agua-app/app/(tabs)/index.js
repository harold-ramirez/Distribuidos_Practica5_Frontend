import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  return (
    <LinearGradient colors={["#11bebe", "#411494"]} style={styles.container}>
      <View>
        <Text>Bienvenido al Sistema Móvil de SEMAPA</Text>
      </View>
    </LinearGradient>
  );
}
