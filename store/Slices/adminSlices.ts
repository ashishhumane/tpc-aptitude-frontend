import { createSlice } from "@reduxjs/toolkit";
import {
  createTest,
  toggleListed,
  deleteTest,
  getUnlistedTests,
  publishResult,
  unpublishResult,
  getAllUsers,
  deleteUser,
  getTopNStudents,
} from "../Actions/adminAction";

interface AdminState {
  tests: any[];
  users: any[];
  topStudents: any[];
  isLoading: boolean;
  error: string | { message: string } | null;
}

const initialState: AdminState = {
  tests: [],
  users: [],
  topStudents: [],
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
          (test) => test.id !== action.payload.id,
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
        console.log("Fetched tests:", action.payload); // Debugging log
        state.tests = action.payload.unlistedTests || []; // Ensure fallback to empty array if undefined
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
        // Optionally update the published test in the tests array
        const index = state.tests.findIndex(
          (test) => test.id === action.payload.id,
        );
        if (index !== -1) {
          state.tests[index] = action.payload;
        }
      })
      .addCase(publishResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Unpublish Result
      .addCase(unpublishResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unpublishResult.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally update the unpublished test in the tests array
        const index = state.tests.findIndex(
          (test) => test.id === action.payload.id,
        );
        if (index !== -1) {
          state.tests[index] = action.payload;
        }
      })
      .addCase(unpublishResult.rejected, (state, action) => {
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
          (user) => user._id !== action.payload.userId,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //gettopnstudents
      .addCase(getTopNStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTopNStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topStudents = action.payload.data; // Assuming response structure
      })
      .addCase(getTopNStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
