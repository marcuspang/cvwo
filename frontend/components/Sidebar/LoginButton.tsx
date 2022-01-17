import { Avatar, Button } from "@chakra-ui/react";
import { UserState } from "../../features/user/userSlice";
import ColourModeButton from "../Layout/ColourModeButton";
import CustomSpinner from "../Layout/CustomSpinner";

interface LoginButtonProps {
  user: UserState;
  isLoading: boolean;
  isError: boolean;
  onClick: () => void;
}

const LoginButton = ({ user, isLoading, isError, onClick }: LoginButtonProps) => {
  if (isLoading) {
    return <CustomSpinner />;
  }
  if (!user || isError) {
    return (
      <>
        <Button mr={3} px={3} w={"full"} onClick={onClick}>
          <Avatar size={"xs"} mr={3} />
          Login here!
        </Button>
        <ColourModeButton />
      </>
    );
  }
  return (
    <>
      <Button mr={3} px={3} w={"full"}>
        <Avatar size={"xs"} mr={3} />
        Welcome!
      </Button>
      <ColourModeButton />
    </>
  );
};

export default LoginButton;
