import {
  Box,
  BoxProps,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useGetCurrentUserQuery } from "../../app/services/user";
import { useAppSelector } from "../../app/store";
import { selectToken } from "../../features/user/userSlice";
import AuthModal from "../UserModal/AuthModal";
import SettingsModal from "../UserModal/SettingsModal";
import LoginButton from "./LoginButton";
import SidebarItems from "./SidebarItems";

interface SidebarContentProps extends BoxProps {}

const SidebarContent = (props: SidebarContentProps) => {
  const { data, isLoading, isError, refetch } = useGetCurrentUserQuery({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = useAppSelector(selectToken);

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
      {token ? (
        <SettingsModal
          isOpen={isOpen}
          onClose={onClose}
          refetchUser={refetch}
        />
      ) : (
        <AuthModal isOpen={isOpen} onClose={onClose} refetchUser={refetch} />
      )}
      <LoginButton isLoading={isLoading} isError={isError} onOpen={onOpen} user={data} />
      <SidebarItems />
    </Box>
  );
};

export default SidebarContent;
