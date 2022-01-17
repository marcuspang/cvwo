import {
  Box,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";
import { setCredentials } from "../../app/features/userSlice";
import { useLoginMutation, useRegisterMutation } from "../../app/services/user";
import { useAppDispatch } from "../../app/store";
import CustomInputControl from "../Layout/CustomInput";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Username too short, please try again.")
    .max(50, "Username too long, please try again.")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Password is required"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const AuthModal = ({ isOpen, onClose }: LoginModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [registering, setRegistering] = useState(true);

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const linkColour = useColorModeValue("gray.800", "gray.200");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialRef}
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
          validationSchema={registering && registerSchema}
          onSubmit={async (values, actions) => {
            if (registering) {
              try {
                const result = await register({
                  username: values.username,
                  email: values.email,
                  password: values.password,
                }).unwrap();
              } catch (e) {
                const errorMessage = (e as { data: { message: string } }).data
                  .message;
                if (errorMessage.includes("duplicate key")) {
                  actions.setFieldError(
                    "email",
                    "Email has already been registered, please try again."
                  );
                } else {
                  onClose();
                }
              }
            } else {
              const result = await login({
                username: values.username,
                email: values.email,
                password: values.password,
              }).unwrap();
              dispatch(
                setCredentials({
                  user: { username: values.username, email: values.email },
                  token: result.data,
                })
              );
              onClose();
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
                {registering && (
                  <CustomInputControl
                    name="passwordConfirmation"
                    label="Password Confirmation"
                    type="password"
                  />
                )}
              </ModalBody>
              <ModalFooter justifyContent={"space-between"}>
                <Box>
                  <Link
                    color={linkColour}
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
