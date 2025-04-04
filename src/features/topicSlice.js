import { createSlice } from '@reduxjs/toolkit';

const topicSlice = createSlice({
  name: "topic",
  initialState: {
    topic: [],
  },
  reducers:{
    setTopicArray: (state, action) => {
        state.topic = action.payload;
    }
  },
});

export const { setTopicArray } = topicSlice.actions;
export default topicSlice.reducer;
