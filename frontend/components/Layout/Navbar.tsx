import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import ColourModeButton from "./ColourModeButton";
import { CustomLink } from "./CustomLink";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Community",
    href: "/community",
  },
  {
    name: "Calendar",
    href: "/calendar",
  },
];

const menuItems: NavItem[] = [
  { name: "Dashboard", href: "/profile/dashboard" },
  { name: "Settings", href: "/profile/settings" },
];

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as={"header"} bg={useColorModeValue("gray.100", "gray.900")}>
      <Container maxW="full">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box fontWeight={"bold"}>CVWO</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {navItems.map((item) => (
                <CustomLink
                  key={"desktop-" + item.name}
                  href={item.href}
                >
                  {item.name}
                </CustomLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <ColourModeButton mr={3} />
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} />
              </MenuButton>
              <MenuList>
                {menuItems.map((item) => (
                  <MenuItem key={item.name}>
                    <NextLink href={item.href}>{item.name}</NextLink>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {navItems.map((item) => (
                <CustomLink key={"mobile-" + item.name} href={item.href}>
                  {item.name}
                </CustomLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

export default Navbar;
