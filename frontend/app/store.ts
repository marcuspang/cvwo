import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { apiWithUser } from "./services/user";
import userReducer from "./features/userSlice";
import listReducer from "./features/listSlice";
import labelReducer from "./features/labelSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    list: listReducer,
    label: labelReducer,
    [apiWithUser.reducerPath]: apiWithUser.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiWithUser.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
