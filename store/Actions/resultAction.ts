import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://13.127.61.140:4000";

// Fetch available test results for a student
export const getAvailableResults = createAsyncThunk(
  "result/getAvailableResults",
  async (student_id: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/result/get-available-results`, { student_id });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch available results");
    }
  }
);

// Fetch test result for a specific test and student
export const getTestResult = createAsyncThunk(
  "result/getTestResult",
  async ({ test_id, student_id }: { test_id: number; student_id: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/result/get-test-result`, { test_id, student_id });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch test result");
    }
  }
);
