import { ListInterface, selectLists } from "../../app/features/listSlice";
import { useGetListsQuery } from "../../app/services/list";
import { useAppSelector } from "../../app/store";
import CustomSpinner from "../Icon/CustomSpinner";
import ListCard from "./ListCard";

const Lists = () => {
  const { data, isLoading } = useGetListsQuery({});
  const lists = useAppSelector(selectLists);

  if (isLoading) {
    return <CustomSpinner />;
  }

  if (lists.length) {
    return (
      <>
        {lists.map((list: ListInterface, key: number) => {
          return <ListCard key={key} listData={list} />;
        })}
      </>
    );
  }
  return null;
};

export default Lists;
