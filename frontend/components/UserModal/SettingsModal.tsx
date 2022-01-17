import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useLogoutMutation } from "../../app/services/user";
import { useAppDispatch } from "../../app/store";
import { setToken } from "../../features/user/userSlice";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchUser: () => void;
}

const SettingsModal = ({
  isOpen,
  onClose,
  refetchUser,
}: SettingsModalProps) => {
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="outside"
      size={"xl"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              logout({});
              onClose();
              // dispatch(setToken(""));
            }}
          >
            Logout
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
