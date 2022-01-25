import { CUIAutoComplete, Item } from "chakra-ui-autocomplete";
import {
  addLabel,
  assignLabel,
  selectLabels,
  selectLabelsByTaskId,
} from "../../app/features/labelSlice";
import type { TaskInterface } from "../../app/features/taskSlice";
import {
  useAddLabelMutation,
  useUpdateLabelMutation,
} from "../../app/services/label";
import { useAppDispatch, useAppSelector } from "../../app/store";

interface LabelAutocompleteProps {
  task: TaskInterface;
}
const LabelAutocomplete = ({ task }: LabelAutocompleteProps) => {
  const currentLabels = useAppSelector(selectLabelsByTaskId(task.id));
  const labels = useAppSelector(selectLabels);
  const dispatch = useAppDispatch();
  const [addNewLabel, { isLoading }] = useAddLabelMutation();
  const [updateLabel, {}] = useUpdateLabelMutation();

  const handleCreateItem = async (item: Item) => {
    const result = await addNewLabel({
      name: item.value,
      tasks: [task.id],
    }).unwrap();
    dispatch(addLabel(result));
  };

  const handleSelectedItemsChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      selectedItems.forEach(async (item) => {
        // if any selected item is in the currentLabels, update the selected labels
        if (!currentLabels.filter((label) => label.id !== +item.value).length) {
          try {
            const result = await updateLabel({
              id: +item.value,
              name: item.label,
              tasks: [task.id],
            }).unwrap();
            dispatch(
              assignLabel({
                labelId: +item.value,
                task,
              })
            );
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  };

  return (
    <CUIAutoComplete
      label="Labels"
      placeholder="Choose labels"
      onCreateItem={handleCreateItem}
      items={labels.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }))}
      selectedItems={currentLabels.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }))}
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
      onSelectedItemsChange={(changes) =>
        handleSelectedItemsChange(changes.selectedItems)
      }
    />
  );
};

export default LabelAutocomplete;
