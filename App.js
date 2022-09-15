import React, { Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import SetName from "./src/screens/SetName";
import Home from "./src/screens/Home";
import PlayGame from "./src/screens/PlayGame";
import AllRooms from "./src/screens/AllRooms";
import LeaderBoards from './src/screens/LeaderBoards';
import Loading from "./src/screens/Loading";
import LogIn from "./src/screens/LogIn";
import LogUp from "./src/screens/LogUp";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux';
import userReducer from './src/slices/user.slices';
import roomReducer from './src/slices/room.slices';
import chatReducer from "./src/slices/chat.slices";

const Stack = createNativeStackNavigator();

const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    chat: chatReducer,
  }
})

export default class App extends Component {

  render() {
    return (
      <Provider store={store} >
        <NavigationContainer >
          <StatusBar hidden ></StatusBar>
          <Stack.Navigator initialRouteName='Loading'>
            <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
            <Stack.Screen name="LogUp" component={LogUp} options={{ headerShown: false }} />
            <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
            <Stack.Screen name="SetName" component={SetName} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='AllRooms' component={AllRooms} options={{ headerShown: false }} />
            <Stack.Screen name='PlayGame' component={PlayGame} options={{ headerShown: false }} />
            <Stack.Screen name='LeaderBoards' component={LeaderBoards} options={{ title: 'Bảng xếp hạng', headerTitleStyle: { fontSize: 18 } }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}