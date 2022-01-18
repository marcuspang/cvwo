import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { setLists } from "../../app/features/listSlice";
import { useAddListMutation } from "../../app/services/list";
import { useAppDispatch } from "../../app/store";

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormInputInterface {
  title: string;
}

const ListModal = ({ isOpen, onClose }: ListModalProps) => {
  const [addList] = useAddListMutation();
  const dispatch = useAppDispatch();
  const form = useForm<FormInputInterface>();
  const onSubmit: SubmitHandler<FormInputInterface> = async (values) => {
    try {
      const result = await addList({ ...values }).unwrap();
      dispatch(
        setLists([
          {
            id: result.id,
            title: result.title,
            archived: result.archived,
            users: result.users,
            tasks: result.tasks,
          },
        ])
      );
      onClose();
    } catch (e) {
      const errorMessage = (e as { data: { message: string } }).data.message;
      if (errorMessage.includes("unauthenticated")) {
        form.setError("title", { message: "Please sign in to create lists." });
      }
    }
  };

  const onError: SubmitErrorHandler<FormInputInterface> = async (error) => {
    form.setError("title", { message: error.title!.message });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new list</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <ModalBody>
            <FormControl isInvalid={!!form.formState.errors.title}>
              <Input
                {...form.register("title", {
                  required: "Please enter a valid title.",
                })}
              />
              {form.formState.errors.title && (
                <FormErrorMessage>
                  {form.formState.errors.title.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ListModal;
