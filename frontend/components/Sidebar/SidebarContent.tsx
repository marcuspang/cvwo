import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import router from "next/router";
import { FaCalendar, FaList, FaTasks } from "react-icons/fa";
import ColourModeButton from "../Layout/ColourModeButton";
import SidebarItem from "./SidebarItem";

interface SidebarContentProps extends BoxProps {}

const SidebarContent = (props: SidebarContentProps) => {
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      p={3}
      overflowX="hidden"
      overflowY="auto"
      bg={useColorModeValue("white", "gray.700")}
      borderColor={useColorModeValue("inherit", "gray.800")}
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex align={"center"} w="full" pb={4}>
        <Button
          mr={3}
          px={3}
          w={"full"}
          bg={useColorModeValue("white", "gray.700")}
          _hover={{
            bg: useColorModeValue("gray.100", "gray.800"),
          }}
        >
          <Avatar size={"xs"} mr={3} />
          Login here
        </Button>
        <ColourModeButton />
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <SidebarItem icon={FaTasks} onClick={() => router.push("/")}>
          Tasks
        </SidebarItem>
        <SidebarItem icon={FaList} onClick={() => router.push("/lists")}>
          Lists
        </SidebarItem>
        <SidebarItem icon={FaCalendar} onClick={() => router.push("/calendar")}>
          Calendar
        </SidebarItem>
      </Flex>
    </Box>
  );
};

export default SidebarContent;
