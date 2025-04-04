import { createSlice } from '@reduxjs/toolkit';

const deptSlice = createSlice({
  name: "dept",
  initialState: {
    dept: [],
  },
  reducers:{
    setDeptArray: (state, action) => {
        state.dept = action.payload;
    }
  },
});

export const { setDeptArray } = deptSlice.actions;
export default deptSlice.reducer;
