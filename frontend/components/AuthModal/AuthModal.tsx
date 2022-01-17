import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Link,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../../app/services/user";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: LoginModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registering, setRegistering] = useState(true);

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const registerHandler = () => {
    register({
      email,
      username,
      password,
    });
    onClose();
  };

  const loginHandler = () => {
    login({
      email,
      username,
      password,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialRef}
      scrollBehavior="outside"
      size={"xl"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {registering ? "Create your account" : "Login"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              ref={initialRef}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Email"
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Password"
              type={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent={"space-between"}>
          <Box>
            <Link
              color={"gray.800"}
              onClick={() => setRegistering((prev) => !prev)}
            >
              {registering ? "Login instead" : "Register instead"}
            </Link>
          </Box>
          <Box>
            <Button
              mr={3}
              onClick={registering ? registerHandler : loginHandler}
            >
              {registering ? "Sign Up" : "Log In"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
