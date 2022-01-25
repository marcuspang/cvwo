import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useLogoutMutation } from "../../app/services/user";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
  selectUser,
  setCredentials,
  userInitialState,
} from "../../app/features/userSlice";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const toast = useToast();
  const user = useAppSelector(selectUser);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{user?.email}</Text>
          <Text>{user?.username}</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={2}
            colorScheme={"messenger"}
            onClick={() => {
              logout({});
              dispatch(setCredentials(userInitialState));
              onClose();
              toast({
                title: "Successfully logged out!",
                status: "success",
                duration: 2000,
                isClosable: true,
              });
            }}
          >
            Logout
          </Button>
          <Button onClick={onClose} variant={"ghost"}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
