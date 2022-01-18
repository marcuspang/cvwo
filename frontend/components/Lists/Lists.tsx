import type { ListInterface } from "../../app/features/listSlice";
import { useGetListsQuery } from "../../app/services/list";
import CustomSpinner from "../Layout/CustomSpinner";
import ListCard from "./ListCard";

const Lists = () => {
  const { data, isLoading } = useGetListsQuery({});

  if (isLoading) {
    return <CustomSpinner />;
  }
  if (data) {
    return data.map((list: ListInterface, key: number) => {
      return <ListCard key={key} listData={list} />;
    });
  }
  return null;
};

export default Lists;
