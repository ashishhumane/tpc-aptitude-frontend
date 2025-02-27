import { createSlice } from "@reduxjs/toolkit";
import {
  submitTest,
  getQuestions,
  evaluateQuickTest,
  getPracticeTests,
  getRealTests,
  getTopStudents,
} from "../Actions/testActions";

// types.ts
export interface TestResult {
  student: {
    name: string;
    rollNumber: string;
    course: string;
    year: string;
  };
  test: {
    title: string;
    date: string;
    totalMarks: number;
    obtainedMarks: number;
    status: "Passed" | "Failed";
  };
  questions: {
    id: number;
    question: string;
    attemptedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}
interface TestState {
  questions: any[];
  testDetails: any | null;
  practiceTests: any[];
  realTests: any[];
  topStudents: any[];
  result: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestState = {
  questions: [],
  testDetails: null,
  practiceTests: [],
  realTests: [],
  topStudents: [],
  result: null as TestResult | null,
  loading: false,
  error: null,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Questions
      .addCase(getQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.testDetails = action.payload.testDetails;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Submit Test
      .addCase(submitTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTest.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(submitTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Evaluate Quick Test
      .addCase(evaluateQuickTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(evaluateQuickTest.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(evaluateQuickTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Practice Tests
      .addCase(getPracticeTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPracticeTests.fulfilled, (state, action) => {
        state.loading = false;
        state.practiceTests = action.payload;
      })
      .addCase(getPracticeTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Real Tests
      .addCase(getRealTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRealTests.fulfilled, (state, action) => {
        state.loading = false;
        state.realTests = action.payload;
      })
      .addCase(getRealTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Top Students
      .addCase(getTopStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.topStudents = action.payload;
      })
      .addCase(getTopStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default testSlice.reducer;
