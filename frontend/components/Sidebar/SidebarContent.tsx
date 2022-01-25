import {
  Box,
  BoxProps,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { selectUser } from "../../app/features/userSlice";
import { useGetCurrentUserQuery } from "../../app/services/user";
import { useAppSelector } from "../../app/store";
import AuthModal from "../Modal/AuthModal";
import SettingsModal from "../Modal/SettingsModal";
import SidebarItems from "./SidebarItems";
import LoginButton from "./SidebarLoginButton";

interface SidebarContentProps extends BoxProps {}

const SidebarContent = (props: SidebarContentProps) => {
  // TODO think of better way to get current user on load?
  const { data, isLoading, isError } = useGetCurrentUserQuery({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useAppSelector(selectUser);

  return (
    <VStack
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      justifyContent={"space-between"}
      p={3}
      gap={0}
      overflowX="hidden"
      overflowY="auto"
      bg={useColorModeValue("white", "gray.700")}
      borderColor={useColorModeValue("inherit", "gray.800")}
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      {user && user.username ? (
        <SettingsModal isOpen={isOpen} onClose={onClose} />
      ) : (
        <AuthModal isOpen={isOpen} onClose={onClose} />
      )}
      <LoginButton
        isLoading={isLoading}
        isError={isError}
        onOpen={onOpen}
        user={data}
      />
      <SidebarItems />
    </VStack>
  );
};

export default SidebarContent;
