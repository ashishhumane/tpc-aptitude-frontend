import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../store";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL;


type SubmitTestPayload = {
  test_id: number | string;
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

      // Build an array form of answers in case the server expects an array
      const answersArray = Object.entries(answers).map(([questionId, optionId]) => ({
        question_id: Number(questionId) || questionId,
        option_id: optionId,
      }));

      const payloadToSend = {
        test_id,
        responses: answers,
        answers_array: answersArray,
      };

      console.debug("Submitting test payload:", payloadToSend);

      const response = await axios.post(
        `${BASE_URL}api/test/result/submit-test`,
        payloadToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Server Error Details:", error.response?.data);
        // Return full response data when available to aid debugging in caller
        return rejectWithValue(error.response?.data || "Submission failed");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const getQuestions = createAsyncThunk(
    "test/getQuestions",
    async (testId: string, { rejectWithValue }) => {
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
          `${BASE_URL}api/test/get-questions/${testId}`,{ withCredentials: true }
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
        `${BASE_URL}api/test/result/evaluate-quick-test`,
        { test_id: id },{withCredentials: true}
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
      const response = await axios.post(`${BASE_URL}api/test/get-practice-tests`,{},{
        withCredentials: true
      });
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
      const response = await axios.post(`${BASE_URL}api/test/get-real-tests`,{},{
        withCredentials: true
      });
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
      const response = await axios.get(`${BASE_URL}/api/get-top-students`,{withCredentials: true});
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
      testId: string;
      remainingTime?: number;
      isSubmitted: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}api/test/handle-test`, {
        studentId,
        testId,
        remainingTime, // Send current time to backend
        isSubmitted, //default is false
      },{
        withCredentials: true
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
