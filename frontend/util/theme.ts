import { extendTheme } from "@chakra-ui/react";

// config to load user system color mode
const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

// extend theme for ChakraUI
const theme = extendTheme({
  config,
});

export default theme;
