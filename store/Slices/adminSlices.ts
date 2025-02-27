import { createSlice } from "@reduxjs/toolkit";
import {
  createTest,
  toggleListed,
  deleteTest,
  getUnlistedTests,
  publishResult,
  getAllUsers,
  deleteUser,
} from "../Actions/adminAction";

interface AdminState {
  tests: any[];
  users: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  tests: [],
  users: [],
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Test
      .addCase(createTest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tests.push(action.payload);
      })
      .addCase(createTest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Toggle Listed
      .addCase(toggleListed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleListed.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(toggleListed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete Test
      .addCase(deleteTest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tests = state.tests.filter(
          (test) => test.id !== action.payload.id
        );
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Unlisted Tests
      .addCase(getUnlistedTests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUnlistedTests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tests = action.payload;
      })
      .addCase(getUnlistedTests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Publish Result
      .addCase(publishResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(publishResult.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(publishResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
