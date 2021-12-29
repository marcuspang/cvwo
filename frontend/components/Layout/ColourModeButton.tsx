import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

interface ColourModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

const ColourModeButton = ({ ...props }: ColourModeButtonProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      aria-label="Colour Mode Button"
      bg={useColorModeValue("white", "gray.700")}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.800"),
      }}
      {...props}
    >
      {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
};

export default ColourModeButton;
