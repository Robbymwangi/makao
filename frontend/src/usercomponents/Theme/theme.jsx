import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  tokens: {
    colors: {
      red: {
        value: "#EE0F0F", // Define a base red color
      },
    },
  },
  semanticTokens: {
    colors: {
      danger: {
        value: "{colors.red}", // Reference the base red color for semantic usage
      },
      primary: {
        default: "blue.500", // Light mode
        _dark: "blue.300", // Dark mode
      },
      secondary: {
        default: "gray.700",
        _dark: "gray.300",
      },
      background: {
        default: "white",
        _dark: "gray.800",
      },
      text: {
        default: "black",
        _dark: "white",
      },
      border: {
        default: "gray.200",
        _dark: "gray.600",
      },
    },
  },
});

export default theme;