import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const TicketIcon = (props) => (
  <FontAwesome name="ticket" size={24} color="black" {...props} />
);

export const HomeIcon = (props) => (
  <FontAwesome5 name="home" size={24} color="black" {...props} />
);

export const EventIcon = (props) => (
  <MaterialIcons name="event" size={24} color="black" {...props} />
);

export const ScanQRIcon = (props) => (
  <MaterialCommunityIcons
    name="qrcode-scan"
    size={24}
    color="black"
    {...props}
  />
);

export const RightIcon = (props) => (
  <FontAwesome5 name="angle-right" size={24} color="black" {...props} />
);
