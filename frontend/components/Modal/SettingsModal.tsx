import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useLogoutMutation } from "../../app/services/user";
import { useAppDispatch } from "../../app/store";
import { setCredentials, userInitialState } from "../../app/features/userSlice";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const toast = useToast();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>

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
