import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
  // base colors
  primary: "#194868", // Dark Blue
  secondary: "#FF615F", // peach

  // colors
  black: "#1E1F20",
  white: "#FFFFFF",
  lightGray: "#F5F7F9",
  lightGray2: "#FAFBFD",
  lightGray3: "#d3d3d3",
  lightGray4: "#adadad",
  gray: "#BEC1D2",
  gray2: "#808080",
  background2: "rgba(206,204,202,0.2)",
  background: "#fafcfb",

  darkgray: "#898C95",
  yellow: "#FFD573",
  lightBlue: "#4da6ff",
  darkgreen: "#008159",
  peach: "#FF615F",
  purple: "#8e44ad",
  red: "#cc3300",
  limegreen: "#32CD32",
  steelblue: "#4682B4",
  mediumseagrean: "mediumseagreen",
  shadow: "#333",

  text: "#343434",
  border: "gray",
  blue: "#4f6d7a",
  offwhite: "#f0f0f0",

  //for exemptions screen, Aprroved, Rejected, Pending
  Goedgekeurd: "green",
  Afgewezen: "darkred",
  "In Behandeling": "#d9b529",
  Gematched: "#008159",
  "Geen Match": "#4f6d7a",

  testgreen: "#97CC76",
  testred: "#ED6D64",
  testyellow: "#",
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  padding2: 36,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: { fontFamily: "Roboto-Bold", fontSize: SIZES.h1, lineHeight: 70 },
  h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22 },
  body1: {
    fontFamily: "Roboto-Regular",
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: "Roboto-Regular",
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: "Roboto-Regular",
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: "Roboto-Regular",
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
