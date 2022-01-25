import { CUIAutoComplete, Item } from "chakra-ui-autocomplete";
import { useState } from "react";
import {
  addLabel,
  LabelInterface,
  selectLabels,
  selectLabelsByTaskId,
  updateTaskLabels,
} from "../../app/features/labelSlice";
import { updateListTask } from "../../app/features/listSlice";
import type { TaskInterface } from "../../app/features/taskSlice";
import { useAddLabelMutation } from "../../app/services/label";
import { useUpdateTaskMutation } from "../../app/services/task";
import { useAppDispatch, useAppSelector } from "../../app/store";
import randomColour from "../../util/randomColour";

interface LabelAutocompleteProps {
  task: TaskInterface;
}
const LabelAutocomplete = ({ task }: LabelAutocompleteProps) => {
  const labels = useAppSelector(selectLabels);
  const currentLabels = useAppSelector(selectLabelsByTaskId(task.id));
  const dispatch = useAppDispatch();
  const [addNewLabel, { isLoading }] = useAddLabelMutation();
  const [updateTask, {}] = useUpdateTaskMutation();

  const [selected, setSelected] = useState(
    currentLabels.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }))
  );
  const [available, setAvailable] = useState(
    labels.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }))
  );

  const handleCreateItem = async (item: Item) => {
    const result = await addNewLabel({
      name: item.value,
      tasks: [task.id],
      colour: randomColour(),
    }).unwrap();

    setAvailable((curr) => [...curr, item]);
    setSelected((curr) => [...curr, item]);
    dispatch(addLabel(result));
  };

  const handleSelectedItemsChange = async (selectedItems?: Item[]) => {
    if (selectedItems) {
      try {
        const result = (await updateTask({
          ...task,
          labels: selectedItems.map((item) => +item.value),
        }).unwrap()) as Omit<TaskInterface, "labels"> & {
          labels: LabelInterface[];
        };
        setSelected(selectedItems);
        dispatch(
          updateTaskLabels({
            taskId: task.id,
            labelIds: result.labels && result.labels.map((label) => label.id),
          })
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <CUIAutoComplete
      label="Labels"
      placeholder="Type something!"
      onCreateItem={handleCreateItem}
      items={available}
      selectedItems={selected}
      labelStyleProps={{ marginBottom: -1 }}
      inputStyleProps={{
        borderRightRadius: 0,
      }}
      toggleButtonStyleProps={{
        marginLeft: "0 !important",
        borderLeftRadius: 0,
      }}
      listItemStyleProps={{
        transition: "0.1s all ease",
      }}
      listStyleProps={{
        marginTop: -2,
        boxShadow: "md",
      }}
      tagStyleProps={{
        marginBottom: 0,
      }}
      onSelectedItemsChange={(changes) =>
        handleSelectedItemsChange(changes.selectedItems)
      }
    />
  );
};

export default LabelAutocomplete;
