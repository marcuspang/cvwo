import { extendTheme } from "@chakra-ui/react";

// extend theme for ChakraUI
const theme = extendTheme({
  // config to load user system color mode
  initialColorMode: "light",
  useSystemColorMode: true,
  components: {
    Button: {
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === "light" ? "white" : "gray.700",
          _hover: {
            bg: props.colorMode === "light" ? "gray.100" : "gray.800",
          },
        }),
      },
    },
  },
  styles: {
    global: (props: { colorMode: string; }) => ({
      body: {
        bg: props.colorMode === "light" ? "gray.50" : "gray.800",
      },
    }),
  },
});
export default theme;
