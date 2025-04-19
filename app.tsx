import { View, Text, AppRegistry } from "react-native";
import { registerRootComponent } from 'expo';

function App () {
  return (
    <Text style={{fontSize: 100, color: 'black'}}>ok</Text>
  );
}

registerRootComponent(App);
