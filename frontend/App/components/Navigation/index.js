import React, { Children, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Home from "../../screens/home";
import Login from "../../screens/auth/Login";
import Signup from "../../screens/auth/Signup";
import Courses from "../../screens/course/Courses";
import Diplomas from "../../screens/diploma/Diplomas";
import { CourseDetail } from "../../screens/course/Details";
import Loading from "../../screens/loading";
import UserDetails from "../../screens/auth/UserDetails";
import { useAuth } from "../../context/AuthContext";

export default () => {
  const [loading, setLoading] = useState(false);

  const MainStack = createStackNavigator();
  const Tabs = createBottomTabNavigator();
  const HomeStack = createStackNavigator();
  const ProfileStack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  const { token, logout } = useAuth();

  //can be deleted..
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
      <MainStack.Screen
        name="Login"
        options={{ headerShown: true, title: "Inloggen" }}
      >
        {(props) => <Login {...props} />}
      </MainStack.Screen>
    </MainStack.Navigator>
  );

  const TabScreen = () => (
    <Tabs.Navigator initialRouteName="Home">
      <Tabs.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeStackScreen}
      />
      {token ? (
        <Tabs.Screen name="Profile" component={UserDetails} />
      ) : (
        <Tabs.Screen
          name="Login"
          options={{ headerShown: true }}
          component={Login}
        />
      )}
    </Tabs.Navigator>
  );

  const HomeStackScreen = () => (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => <Home {...props} />}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="Courses"
        component={Courses}
        options={{ title: "Vakken" }}
      />
      <HomeStack.Screen name="Diplomas" component={Diplomas} />
    </HomeStack.Navigator>
  );

  const LoggedOutStackScreen = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Login"
        options={{ headerShown: true, title: "Inloggen" }}
      >
        {(props) => <Login {...props} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="Sign Up"
        options={{ headerShown: true, title: "Registreren" }}
      >
        {(props) => <Signup {...props} />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );

  const LoggedInStackScreen = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        options={{ headerShown: true, title: "Profiel" }}
      >
        {(props) => <UserDetails {...props} />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );

  const CustomDrawerContent = (props) => {
    return (
    <DrawerContentScrollView>
      <DrawerItemList {...props}/>
      {token &&<DrawerItem label="Uitloggen" onPress={() => logout()}/>}
    </DrawerContentScrollView>
    )
  }

  const DrawerScreen = () => (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={TabScreen} />
      {token ? (
        <Drawer.Screen name="Profile" component={LoggedInStackScreen} />
      ) : (
        <Drawer.Screen name="Login" component={LoggedOutStackScreen} />
      )}
    </Drawer.Navigator>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <DrawerScreen />
    </NavigationContainer>
  );
};
