import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Home from "../../screens/home";
import Login from '../../screens/auth/Login';
import Signup from '../../screens/auth/Signup'

export default () => {
  const MainStack = createStackNavigator();
  const Tabs = createBottomTabNavigator();
  const HomeStack = createStackNavigator();
  const ProfileStack = createStackNavigator();

  const MainStackScreen = () => (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <Home {...props} />}
      </MainStack.Screen>
      <MainStack.Screen name="Login" options={{ headerShown: true, title: "Inloggen" }}>
        {(props) => <Login {...props}/>}
      </MainStack.Screen>
    </MainStack.Navigator>
  );

  const TabsScreen = () => (
    <Tabs.Navigator>
        <Tabs.Screen name="Profile" options={{ headerShown: true}} component={ProfileStackScreen}/>
      <Tabs.Screen name="Home" options={{ headerShown: false}} component={HomeStackScreen}/>
    
 
    </Tabs.Navigator>
  )

  const HomeStackScreen = () => (
    <HomeStack.Navigator>
    <HomeStack.Screen name="Home" options={{ headerShown: false}}>
        {(props) => <Home {...props}/>}
        </HomeStack.Screen>
    </HomeStack.Navigator>
  )

  
  const ProfileStackScreen = () => (
    <ProfileStack.Navigator>
  <ProfileStack.Screen name="Login" options={{ headerShown: true, title: "Inloggen" }}>
        {(props) => <Login {...props}/>}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  )

  return (
    <NavigationContainer>
      <TabsScreen />
    </NavigationContainer>
  );
};
