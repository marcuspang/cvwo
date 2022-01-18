import { Avatar, Button, Flex } from "@chakra-ui/react";
import type { UserInterface } from "../../app/features/userSlice";
import ColourModeButton from "../Layout/ColourModeButton";
import CustomSpinner from "../Layout/CustomSpinner";

interface LoginButtonProps {
  isLoading: boolean;
  isError: boolean;
  onOpen: () => void;
  user: UserInterface;
}

const LoginButton = ({
  isLoading,
  isError,
  onOpen,
  user,
}: LoginButtonProps) => {
  if (isLoading) {
    return <CustomSpinner />;
  }

  return (
    <Flex align={"center"} w="full" pb={4}>
      <Button mr={3} px={3} w={"full"} onClick={onOpen}>
        <Avatar size={"xs"} mr={3} />
        {!user || isError ? "Login here!" : "Hello " + user.username}
      </Button>
      <ColourModeButton />
    </Flex>
  );
};

export default LoginButton;
