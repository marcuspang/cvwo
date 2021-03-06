import { useEffect, useState } from "react";
import { ListInterface, selectLists } from "../../app/features/listSlice";
import { useGetLabelsQuery } from "../../app/services/label";
import { useGetListsQuery } from "../../app/services/list";
import { useAppSelector } from "../../app/store";
import CustomSpinner from "../Icon/CustomSpinner";
import ListCard from "./ListCard";

const Lists = () => {
  const [skip, setSkip] = useState(false);
  const { data, isLoading } = useGetListsQuery(
    {},
    {
      skip,
    }
  );
  const { data: labelData, isLoading: labelIsLoading } = useGetLabelsQuery(
    {},
    {
      skip,
    }
  );
  const lists = useAppSelector(selectLists);

  useEffect(() => {
    if (skip) {
      setSkip((prev) => !prev);
    }
  }, []);

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
