import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../store";
import { useSelector } from "react-redux";

const BASE_URL = "http://new-portal-loadbalancer-1041373362.ap-south-1.elb.amazonaws.com/api";


type SubmitTestPayload = {
  test_id: number;
  answers: Record<number, number>; // { [question_id]: option_id }
};

export const submitTest = createAsyncThunk(
  "test/submitTest",
  async (
    { test_id, answers }: SubmitTestPayload,
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState; // FIX: Explicitly use getState from thunkAPI
      const token = state.auth.token;

      if (!token) {
        throw new Error("Authorization token is missing"); // Catch missing token issue
      }

      const response = await axios.post(
        `${BASE_URL}/test/submit-test`,
        { test_id, responses: answers },
        {
          headers: {
            Authorization: `${token}`, // FIX: Use Bearer token format
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Server Error Details:", error.response?.data);
        return rejectWithValue(
          error.response?.data?.message || "Submission failed"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

  export const getQuestions = createAsyncThunk(
    "test/getQuestions",
    async (testId: number, { rejectWithValue }) => {
      // Fisher-Yates shuffle algorithm
      const shuffleArray = <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      try {
        const response = await axios.get(
          `${BASE_URL}/test/get-questions/${testId}`
        );
        const data = JSON.parse(JSON.stringify(response.data)); // Deep clone
  
        // Handle different response structures
        const questionsPath = data.test?.questions || data.questions;
        
        if (questionsPath) {
          // Shuffle questions
          const shuffledQuestions = shuffleArray(questionsPath);
          
          // Shuffle options within each question
          shuffledQuestions.forEach((question: any) => {
            if (question.options) {
              question.options = shuffleArray(question.options);
            }
          });
  
          // Update data structure based on API format
          if (data.test) {
            data.test.questions = shuffledQuestions;
          } else {
            data.questions = shuffledQuestions;
          }
        }
  
        return data;
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
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/test/evaluate-quick-test`,
        { test_id: Number(id) }
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
      const response = await axios.post(`${BASE_URL}/test/get-practice-tests`);
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

// testActions.ts
export const fetchTestStatus = createAsyncThunk(
  "test/fetchTestStatus",
  async (
    {
      studentId,
      testId,
      remainingTime, // Add optional parameter
      isSubmitted,
    }: {
      studentId: number;
      testId: number;
      remainingTime?: number;
      isSubmitted: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}/test/handle-test`, {
        studentId,
        testId,
        remainingTime, // Send current time to backend
        isSubmitted, //default is false
      });
      return {
        remainingTime: response.data.remainingTime,
        isSubmitted: response.data.isSubmitted,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
export function getState(): RootState {
  return useSelector((state: RootState) => state);
}
