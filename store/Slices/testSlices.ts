import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  submitTest,
  getQuestions,
  evaluateQuickTest,
  getPracticeTests,
  getRealTests,
  getTopStudents,
  fetchTestStatus,
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
  remainingTime: number | null; // Track remaining time for tests
  isTestSubmitted: boolean; // Track if the test is submitted
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
  remainingTime: null, // Track remaining time for tests
  isTestSubmitted: false, // Track if the test is submitted
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    decrementTime: (state) => {
      if (state.remainingTime !== null) {
        state.remainingTime = Math.max(0, state.remainingTime - 1);
      }
    },
    initializeTime: (state, action: PayloadAction<number>) => {
      state.remainingTime = action.payload;
    },
    setInitialTime: (state, action: PayloadAction<number>) => {
      state.remainingTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.remainingTime = action.payload.remainingTime;
        state.isTestSubmitted = action.payload.isSubmitted ?? false;
      })
      .addCase(fetchTestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Questions
      .addCase(getQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.test?.questions || action.payload.questions;
    state.testDetails = action.payload.test || action.payload;
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

export const { decrementTime,initializeTime,setInitialTime } = testSlice.actions;
export default testSlice.reducer;
