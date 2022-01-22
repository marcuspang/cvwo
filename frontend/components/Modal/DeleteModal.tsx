import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onConfirm: () => void;
}

const DeleteModal = ({
  isOpen,
  onClose,
  isLoading,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delete?</ModalHeader>
        <ModalCloseButton />
        <ModalFooter>
          <Button isLoading={isLoading} onClick={onConfirm} mr={2}>
            Confirm
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
