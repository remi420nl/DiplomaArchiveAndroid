import React, { useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../assets/constants";
import Loading from "../../components/loading";
import {
  Home,
  Login,
  Signup,
  Courses,
  Diplomas,
  UserDetails,
  AddCourse,
  AddDiploma,
  DiplomaDetails,
  CourseDetails,
  Exemptions,
  Competences,
  ManageCourse,
  ManageDiploma,
  EditCompetences,
  Keywords,
  Contact,
  StudentExemptions,
} from "../../screens";

//Navigation V5 for the Stack, Bottom and Drawer navigators

export default () => {
  const [loading, setLoading] = useState(false);

  const Tabs = createBottomTabNavigator();
  const HomeStack = createStackNavigator();
  const ProfileStack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  const { token, logout } = useAuth();

  const Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: COLORS.background,
    },
  };

  const TabScreen = () => (
    <Tabs.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        style: {
          backgroundColor: COLORS.primary,
          paddingBottom: 12,
        },
        labelStyle: {
          color: COLORS.white,

          fontSize: 20,
          fontWeight: "bold",
          letterSpacing: 1,
        },
      }}
      activeColor="#00aea2"
      inactiveColor="#95a5a6"
    >
      <Tabs.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeStackScreen}
      />
      {token ? (
        <Tabs.Screen name="Profiel" component={UserDetails} />
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
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTransparent: true,
      }}
    >
      <HomeStack.Screen name="Home" options={{ headerShown: false }} head>
        {(props) => <Home {...props} />}
      </HomeStack.Screen>
      <HomeStack.Screen
        name="Courses"
        component={Courses}
        options={{
          title: "Vakken",
        }}
      />
      <HomeStack.Screen
        name="Course"
        component={CourseDetails}
        options={{
          title: "Vak",
        }}
      />
      <HomeStack.Screen
        name="Diplomas"
        component={Diplomas}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="Diploma" component={DiplomaDetails} />
      <HomeStack.Screen name="AddDiploma" component={AddDiploma} />
      <HomeStack.Screen
        name="Exemptions"
        component={Exemptions}
        options={{
          title: "Vrijstellingen",
        }}
      />
      <HomeStack.Screen
        name="StudentExemptions"
        component={StudentExemptions}
        options={{
          title: "Goedgekeurde Vrijstellingen",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="Competences"
        component={Competences}
        options={{ title: "Competenties vergelijken" }}
      />
      <HomeStack.Screen
        name="EditCompetences"
        component={EditCompetences}
        options={{
          title: "Competenties bewerken",
        }}
      />
      <HomeStack.Screen
        name="Keywords"
        component={Keywords}
        options={{
          title: "Competentie bewerken",
        }}
      />
      <HomeStack.Screen
        name="ManageCourse"
        component={ManageCourse}
        options={{
          title: "Vak Competenties Beheren",
        }}
      />
      <HomeStack.Screen
        name="ManageDiploma"
        component={ManageDiploma}
        options={{
          title: "Diploma Competencies beheren",
        }}
      />
      <HomeStack.Screen
        name="CreateCourse"
        options={{
          headerShown: true,
          title: "Vak toevoegen",
        }}
        component={AddCourse}
      />
      <HomeStack.Screen
        name="Sign Up"
        options={{
          headerShown: false,
          title: "Registreren",
        }}
      >
        {(props) => <Signup {...props} />}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );

  const LoggedOutStackScreen = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Login"
        options={{ headerShown: false, title: "Inloggen" }}
      >
        {(props) => <Login {...props} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="Sign Up"
        options={{ headerShown: false, title: "Registreren" }}
      >
        {(props) => <Signup {...props} />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );

  const LoggedInStackScreen = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profiel"
        options={{ headerShown: true, title: "Profiel" }}
      >
        {(props) => <UserDetails {...props} />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
        {token && (
          <DrawerItem
            label="Uitloggen"
            onPress={() => {
              logout();
            }}
          />
        )}
      </DrawerContentScrollView>
    );
  };

  const DrawerScreen = () => (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={TabScreen} />
      {token ? (
        <Drawer.Screen name="Profiel" component={LoggedInStackScreen} />
      ) : (
        <Drawer.Screen name="Inloggen" component={LoggedOutStackScreen} />
      )}
      <Drawer.Screen name="Contact" component={Contact} />
    </Drawer.Navigator>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer theme={Theme}>
      <DrawerScreen />
    </NavigationContainer>
  );
};
