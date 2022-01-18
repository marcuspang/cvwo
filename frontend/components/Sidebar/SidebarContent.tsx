import {
  Box,
  BoxProps,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { selectUser } from "../../app/features/userSlice";
import { useGetCurrentUserQuery } from "../../app/services/user";
import { useAppSelector } from "../../app/store";
import AuthModal from "../UserModal/AuthModalTest";
import SettingsModal from "../UserModal/SettingsModal";
import LoginButton from "./LoginButton";
import SidebarItems from "./SidebarItems";

interface SidebarContentProps extends BoxProps {}

const SidebarContent = (props: SidebarContentProps) => {
  // TODO think of better way to get current user on load?
  const { data, isLoading, isError } = useGetCurrentUserQuery({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useAppSelector(selectUser);

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
    </Box>
  );
};

export default SidebarContent;
