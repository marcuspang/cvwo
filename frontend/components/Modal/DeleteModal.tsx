import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";

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
  const leastDestructiveRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={leastDestructiveRef}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogCloseButton />
        <AlertDialogHeader>Confirm Delete?</AlertDialogHeader>
        <AlertDialogBody>
          <Text>You can restore this item later in your archives</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            isLoading={isLoading}
            onClick={onConfirm}
            mr={2}
            colorScheme={"messenger"}
          >
            Confirm
          </Button>
          <Button ref={leastDestructiveRef} onClick={onClose} variant={"ghost"}>
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
