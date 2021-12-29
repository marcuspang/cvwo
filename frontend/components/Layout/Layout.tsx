import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Sidebar from "../Sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const sidebar = useDisclosure();
  // Sidebar shows up on md sizepoint and above, hidden
  // within a drawer below md sizepoint
  // Adjacent box is the main page content
  return (
    <Box
      as="section"
      minH={"100vh"}
      background={useColorModeValue("gray.50", "gray.800")}
    >
      <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.onClose} />
      <Box as="main" ml={{ base: 0, md: 60 }}>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg={useColorModeValue("white", "gray.800")}
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          h="14"
          display={{ base: "flex", md: "none" }}
        >
          {/* for opening menu in mobile */}
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={sidebar.onOpen}
            icon={<HamburgerIcon />}
            size="md"
            bg={useColorModeValue("white", "gray.800")}
            _hover={{
              bg: useColorModeValue("gray.100", "gray.900"),
            }}
          />
        </Flex>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
