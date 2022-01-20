import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
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
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  FieldErrors,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { setCredentials } from "../../app/features/userSlice";
import { useLoginMutation, useRegisterMutation } from "../../app/services/user";
import { useAppDispatch } from "../../app/store";
import isValidEmail from "../../util/isValidEmail";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormInputInterface {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const AuthModal = ({ isOpen, onClose }: LoginModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [registering, setRegistering] = useState(true);

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const form = useForm<FormInputInterface>();
  const onSubmit: SubmitHandler<FormInputInterface> = async (values) => {
    if (registering) {
      try {
        await register({
          username: values.username,
          email: values.email.toLowerCase(),
          password: values.password,
        }).unwrap();
        setRegistering((prev) => !prev);
      } catch (e) {
        const errorMessage = (e as FieldErrors).data.message;
        if (errorMessage && errorMessage.includes("duplicate key")) {
          form.setError("email", {
            message: "Email has already been registered, please try again.",
          });
        }
      }
    } else {
      try {
        const result = await login({
          email: values.email,
          password: values.password,
        }).unwrap();
        dispatch(
          setCredentials({
            user: result,
            token: result.data,
          })
        );
        onClose();
      } catch (e) {}
    }
  };

  const onError: SubmitErrorHandler<FormInputInterface> = async (errors) => {
    for (let error in errors) {
      const errorValue = errors[error as keyof typeof errors];
      if (errorValue) {
        form.setError(error as keyof typeof errors, errorValue);
      }
    }
  };
  // for password confirmation
  const password = useRef({});
  password.current = form.watch("password", "");

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
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <ModalBody>
            <FormControl isInvalid={!!form.formState.errors.username} mb={2}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                {...form.register("username", {
                  required: "Username required",
                  minLength: { value: 6, message: "Minimum length of 6" },
                  maxLength: { value: 50, message: "Maximum length of 50" },
                })}
              />
              {form.formState.errors.username && (
                <FormErrorMessage>
                  {form.formState.errors.username.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!form.formState.errors.email} mb={2}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                {...form.register("email", {
                  required: "Email required",
                  validate: (email) =>
                    isValidEmail(email) || "Enter a valid email",
                })}
                type={"email"}
              />
              {form.formState.errors.email && (
                <FormErrorMessage>
                  {form.formState.errors.email.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!form.formState.errors.password} mb={2}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                {...form.register("password", {
                  required: "Password required",
                  minLength: {
                    value: 6,
                    message: "Minimum length of 6",
                  },
                })}
                type={"password"}
              />
              {form.formState.errors.password && (
                <FormErrorMessage>
                  {form.formState.errors.password.message}
                </FormErrorMessage>
              )}
            </FormControl>
            {registering && (
              <FormControl
                isInvalid={!!form.formState.errors.passwordConfirmation}
                mb={2}
              >
                <FormLabel htmlFor="passwordConfirmation">
                  Password Confirmation
                </FormLabel>

                <Input
                  {...form.register("passwordConfirmation", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  })}
                  type={"password"}
                />
                {form.formState.errors.passwordConfirmation && (
                  <FormErrorMessage>
                    {form.formState.errors.passwordConfirmation.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter justifyContent={"space-between"}>
            <Box>
              <Link
                color={linkColour}
                onClick={() => {
                  // form.setErrors({});
                  setRegistering((prev) => !prev);
                }}
              >
                {registering ? "Login instead" : "Register instead"}
              </Link>
            </Box>
            <Box>
              <Button
                mr={3}
                isLoading={form.formState.isSubmitting}
                type="submit"
              >
                {registering ? "Sign Up" : "Log In"}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
