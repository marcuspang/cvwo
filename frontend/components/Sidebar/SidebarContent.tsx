import {
  Avatar,
  Box,
  BoxProps,
  Button,
  Flex,
  Spinner,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import router from "next/router";
import { FaCalendar, FaList, FaTasks } from "react-icons/fa";
import { useGetCurrentUserQuery } from "../../app/services/user";
import ColourModeButton from "../Layout/ColourModeButton";
import LoginModal from "../LoginModal/LoginModal";
import LoginButton from "./LoginButton";
import SidebarItem from "./SidebarItem";

interface SidebarContentProps extends BoxProps {}

const SidebarContent = (props: SidebarContentProps) => {
  const { data: user, isLoading, isError } = useGetCurrentUserQuery({});
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <LoginModal isOpen={isOpen} onClose={onClose} />
      <Flex align={"center"} w="full" pb={4}>
        <LoginButton isLoading={isLoading} user={user} isError={isError} onClick={onOpen} />
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
