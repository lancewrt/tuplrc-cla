import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk for fetching resources with search query
export const fetchResources = createAsyncThunk(
  "resource/fetchResources",
  async ({ searchQuery, type, dept, topic }) => {
    try {
      // Construct query parameters dynamically
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (type) queryParams.append("type", type);
      if (dept) queryParams.append("dept", dept);
      if (topic) queryParams.append("topic", topic);

      const url = `https://api.tuplrc-cla.com/api/online-catalog/resources?${queryParams.toString()}`;

      console.log("Fetching from:", url);

      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch resources");

      return await response.json();
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  }
);

const resourceSlice = createSlice({
  name: "resource",
  initialState: {
    resource: [],
    loading: false,
    error: null,
    searchQuery: '',
    searchPerformed:false
  },
  reducers:{
    setSearchQuery: (state, action) => {
        state.searchQuery = action.payload;
    },
    setResource: (state, action) => {
      state.resource = action.payload;
    },
    setSearchPerformed:(state, action) => {
      state.searchPerformed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resource = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSearchQuery, setResource, setSearchPerformed } = resourceSlice.actions;
export default resourceSlice.reducer;
