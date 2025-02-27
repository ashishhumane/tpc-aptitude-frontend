import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const BASE_URL = "http://localhost:5000/api";

export const submitTest = createAsyncThunk(
  "test/submitTest",
  async (testData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/submit-test`,
        testData
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const getQuestions = createAsyncThunk(
  "test/getQuestions",
  async (testId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/test/get-questions/${testId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const evaluateQuickTest = createAsyncThunk(
  "test/evaluateQuickTest",
  async (testData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/test/evaluate-quick-test`,
        testData
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const getPracticeTests = createAsyncThunk(
  "test/getPracticeTests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/test/get-practice-tests`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const getRealTests = createAsyncThunk(
  "test/getRealTests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/test/get-real-tests`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const getTopStudents = createAsyncThunk(
  "test/getTopStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/get-top-students`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
