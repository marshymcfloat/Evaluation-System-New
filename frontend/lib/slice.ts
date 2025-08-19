import { Action, createSlice } from "@reduxjs/toolkit";
import { Subject } from "../../shared/prisma";

type AdminStateType = {
  subjects: Subject[];
};

const adminInitialState: AdminStateType = {
  subjects: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState: adminInitialState,
  reducers: {
    addSubjects(state, action) {
      console.log(action.payload);
      state.subjects = action.payload;
    },
  },
});

export const adminSliceAction = adminSlice.actions;
