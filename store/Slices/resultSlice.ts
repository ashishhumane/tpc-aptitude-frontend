import { createSlice } from "@reduxjs/toolkit";
import { getTestResult, getAvailableResults } from "../Actions/resultAction";

interface Option {
  id: number;
  questionId: number;
  text: string;
  imageLink?: string | null;
  isCorrect: boolean;
}

interface Question {
  id: number;
  testId: number;
  text: string;
  imageLink?: string | null;
  difficulty: string;
  options: Option[];
}

interface TestResult {
  id: number;
  name: string;
  description: string;
  timeLimit: number;
  totalQuestions: number;
  createdAt: string;
  updatedAt: string;
  isListed: boolean;
  quickEvaluation: boolean;
  resultPublished: boolean;
  questions: Question[];
}

interface ResultState {
  testResult: TestResult | null;
  availableResults: TestResult[];
  loading: boolean;
  error: string | null;
}

const initialState: ResultState = {
  testResult: null,
  availableResults: [],
  loading: false,
  error: null,
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTestResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTestResult.fulfilled, (state, action) => {
        state.loading = false;
        state.testResult = action.payload;
      })
      .addCase(getTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAvailableResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableResults.fulfilled, (state, action) => {
        state.loading = false;
        state.availableResults = action.payload;
      })
      .addCase(getAvailableResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default resultSlice.reducer;
