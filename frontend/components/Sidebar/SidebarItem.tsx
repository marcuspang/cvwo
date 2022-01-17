import { Flex, useColorModeValue, Icon, FlexProps } from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface SidebarItemProps extends FlexProps {
  icon: IconType;
  children?: React.ReactNode;
}

const SidebarItem = ({ icon, children, ...rest }: SidebarItemProps) => {
  const iconColour = useColorModeValue("gray.600", "gray.300");
  return (
    <Flex
      align="center"
      py="3"
      cursor="pointer"
      color={useColorModeValue("inherit", "gray.400")}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.800"),
        color: useColorModeValue("gray.900", "gray.200"),
      }}
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      rounded={"md"}
      {...rest}
    >
      {icon && (
        <Icon
          mx="4"
          boxSize="4"
          _groupHover={{
            color: iconColour,
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

export default SidebarItem;
