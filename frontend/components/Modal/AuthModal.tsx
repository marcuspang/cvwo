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
  useToast
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  FieldErrors,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
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
  const toast = useToast();

  const [registerUser] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const { formState, setError, watch, handleSubmit, register } =
    useForm<FormInputInterface>();
  const onSubmit: SubmitHandler<FormInputInterface> = async (values) => {
    try {
      if (registering) {
        await registerUser({
          username: values.username,
          email: values.email.toLowerCase(),
          password: values.password,
        }).unwrap();
        setRegistering((prev) => !prev);
        toast({
          title: "Successfully registered!",
          description: "Please click login to start creating lists.",
          duration: 1000,
          status: "success",
          isClosable: true,
        });
      } else {
        const result = await login({
          username: values.username,
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
        toast({
          title: "Successfully logged in!",
          status: "success",
          isClosable: true,
        });
      }
    } catch (e) {
      const errorMessage = (e as FieldErrors).data.message;
      if (errorMessage) {
        if (errorMessage.includes("duplicate key")) {
          setError("email", {
            message: "Email has already been registered, please try again.",
          });
        }
        if (errorMessage.includes("password")) {
          setError("password", {
            message: "Incorrect password",
          });
        }
        if (errorMessage.includes("user")) {
          setError("username", {
            message: "Please check your username/email",
          });
          setError("email", {
            message: "Please check your username/email",
          });
        }
      }
    }
  };

  // frontend error handling
  const onError: SubmitErrorHandler<FormInputInterface> = async (errors) => {
    for (let error in errors) {
      const errorValue = errors[error as keyof typeof errors];
      if (errorValue) {
        setError(error as keyof typeof errors, errorValue);
      }
    }
  };
  // for password confirmation
  const password = useRef({});
  password.current = watch("password", "");

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
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <ModalBody>
            <FormControl isInvalid={!!formState.errors.username} mb={2}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                {...register("username", {
                  required: "Username required",
                  minLength: { value: 6, message: "Minimum length of 6" },
                  maxLength: { value: 50, message: "Maximum length of 50" },
                })}
              />
              {formState.errors.username && (
                <FormErrorMessage>
                  {formState.errors.username.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!formState.errors.email} mb={2}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                {...register("email", {
                  required: "Email required",
                  validate: (email) =>
                    isValidEmail(email) || "Enter a valid email",
                })}
                type={"email"}
              />
              {formState.errors.email && (
                <FormErrorMessage>
                  {formState.errors.email.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!formState.errors.password} mb={2}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                {...register("password", {
                  required: "Password required",
                  minLength: {
                    value: 6,
                    message: "Minimum length of 6",
                  },
                })}
                type={"password"}
              />
              {formState.errors.password && (
                <FormErrorMessage>
                  {formState.errors.password.message}
                </FormErrorMessage>
              )}
            </FormControl>
            {registering && (
              <FormControl
                isInvalid={!!formState.errors.passwordConfirmation}
                mb={2}
              >
                <FormLabel htmlFor="passwordConfirmation">
                  Password Confirmation
                </FormLabel>

                <Input
                  {...register("passwordConfirmation", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  })}
                  type={"password"}
                />
                {formState.errors.passwordConfirmation && (
                  <FormErrorMessage>
                    {formState.errors.passwordConfirmation.message}
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
                  setRegistering((prev) => !prev);
                }}
              >
                {registering ? "Login instead" : "Register instead"}
              </Link>
            </Box>
            <Box>
              <Button mr={3} isLoading={formState.isSubmitting} type="submit">
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
