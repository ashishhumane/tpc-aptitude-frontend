import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../store"; // Adjust the path as necessary

const BASE_URL = "https://tpc-aptitude-portal-backend.onrender.com/api";

export const createTest = createAsyncThunk(
  "admin/createTest",
  async (testData: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token; // Get token from Redux state

      const response = await axios.post(
        `${BASE_URL}/admin/create-test`,
        testData,
        {
          headers: {
            Authorization: `${token}`, // Add Bearer token
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const toggleListed = createAsyncThunk(
  "admin/toggleListed",
  async (testId: number, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/toggle-listed`, {
        testId,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
    }
  }
);

export const deleteTest = createAsyncThunk(
  "admin/deleteTest",
  async (testId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/admin/delete-test/${testId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
    }
  }
);

// Action to fetch unlisted tests
export const getUnlistedTests = createAsyncThunk(
  "admin/getUnlistedTests",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await axios.get(`${BASE_URL}/admin/get-unlisted-test`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || "An error occurred while fetching tests"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const response = await axios.post(
        `${BASE_URL}/admin/get-all-users`,
        {},
        {
          headers: {
            Authorization: `${token}`, // Include token in headers
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/admin/delete-user/${userId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
    }
  }
);

// Action to publish a test result
export const publishResult = createAsyncThunk(
  "admin/publishResult",
  async (testId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await axios.post(
        `${BASE_URL}/admin/publish-result`,
        { test_id: testId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data ||
            "An error occurred while publishing the result"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Action to unpublish a test result
export const unpublishResult = createAsyncThunk(
  "admin/unpublishResult",
  async (testId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await axios.post(
        `${BASE_URL}/admin/unpublish-result`,
        { test_id: testId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data ||
            "An error occurred while unpublishing the result"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
