import {
  Box,
  Button,
  FormLabel,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { InputControl, FormControl } from "formik-chakra-ui";
import { useRef, useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../../app/services/user";
import { useAppDispatch } from "../../app/store";
import { setToken } from "../../features/user/userSlice";
import CustomInputControl from "../Layout/CustomInput";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchUser: () => void;
}

const AuthModal = ({ isOpen, onClose, refetchUser }: LoginModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [registering, setRegistering] = useState(true);

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

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
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={async (values, actions) => {
            if (registering) {
              register({
                ...values,
              });
              onClose();
            } else {
              const result = await login({ ...values }).unwrap();
              dispatch(setToken(result.data));
              onClose();
              refetchUser();
            }
          }}
        >
          {(props) => (
            <Form>
              <ModalBody>
                <CustomInputControl
                  name="username"
                  label="Username"
                  type="text"
                  mb={2}
                />
                <CustomInputControl
                  name="email"
                  label="Email"
                  type="email"
                  mb={2}
                />
                <CustomInputControl
                  name="password"
                  label="Password"
                  type="password"
                />
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
                  <Button mr={3} isLoading={props.isSubmitting} type="submit">
                    {registering ? "Sign Up" : "Log In"}
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </Box>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
