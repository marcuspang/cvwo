import { Button, Center, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  return (
    <Button w={"full"} variant={"outline"} leftIcon={<FcGoogle />}>
      <Center>
        <Text>Sign in with Google</Text>
      </Center>
    </Button>
  );
};

export default GoogleLoginButton;
