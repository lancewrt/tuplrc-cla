import { createSlice } from '@reduxjs/toolkit';

const typeSlice = createSlice({
  name: "type",
  initialState: {
    type: [],
  },
  reducers:{
    setTypeArray: (state, action) => {
        state.type = action.payload;
    }
  },
});

export const { setTypeArray } = typeSlice.actions;
export default typeSlice.reducer;
