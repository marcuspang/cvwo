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
import { Form, Formik } from "formik";
import { setLists } from "../../app/features/listSlice";
import { useAddListMutation } from "../../app/services/list";
import { useAppDispatch } from "../../app/store";
import CustomInputControl from "../Layout/CustomInput";

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ListModal = ({ isOpen, onClose }: ListModalProps) => {
  const [addList] = useAddListMutation();
  const dispatch = useAppDispatch();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new list</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ title: "" }}
          onSubmit={async (values, actions) => {
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
              const errorMessage = (e as { data: { message: string } }).data
                .message;
              if (errorMessage.includes("unauthenticated")) {
                actions.setFieldError(
                  "title",
                  "Please sign in to create lists."
                );
              }
            }
          }}
        >
          {(props) => (
            <Form>
              <ModalBody>
                <CustomInputControl
                  name="title"
                  label="List Name"
                  type="text"
                  mb={2}
                />
              </ModalBody>

              <ModalFooter>
                <Button type="submit" isLoading={props.isSubmitting}>
                  Submit
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default ListModal;
