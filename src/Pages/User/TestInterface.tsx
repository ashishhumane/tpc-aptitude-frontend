import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { store } from "../../../store/store";
import {shallowEqual} from "react-redux"
import {
  getQuestions ,
  fetchTestStatus ,
  submitTest ,
} from "../../../store/Actions/testActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner.tsx"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Flag,
  AlertCircle,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { useParams, useNavigate } from "react-router-dom";

import { decrementTime } from "../../../store/Slices/testSlices";
import axios from "axios";

const TestInterface = () => {
  const [enlargedImage, setEnlargedImage] = useState<{
    url: string;
    optionText?: string;
  } | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const fullScreenRef = useRef(false);
  const escapeAttemptRef = useRef(0);


  const navigate = useNavigate();
  const { questions, testDetails, loading, error, remainingTime, isTestSubmitted } = useSelector(
      (state: RootState) => ({
        questions: state.test.questions,
        testDetails: state.test.testDetails,
        loading: state.test.loading,
        error: state.test.error,
        remainingTime: state.test.remainingTime,
        isTestSubmitted: state.test.isTestSubmitted,
      }),
      shallowEqual // Add shallow equality check
  );
  const persistedData = localStorage.getItem("persist:root");



  const studentId = persistedData
    ? JSON.parse(JSON.parse(persistedData).auth).user.userId
    : null;

  const { testId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(
    new Set()
  );

  // Add this useEffect hook to fetch test content
  useEffect(() => {
    const loadTestContent = async () => {
      if (testId) {
        try {
          // Fetch test questions and details
          await dispatch(getQuestions(Number(testId))).unwrap();

          // Fetch test status (time remaining, submission status)
          await dispatch(
            fetchTestStatus({
              studentId: studentId!,
              testId: Number(testId),
              isSubmitted: false,
            })
          ).unwrap();
        } catch (error) {
          console.error("Failed to load test content:", error);
        }
      }
    };

    loadTestContent().then(r => console.log(r));
  }, [dispatch, testId, studentId]);

  // Modify the initialization useEffect to handle missing testDetails
  useEffect(() => {
    const initializeTest = async () => {
      if (testId && studentId && testDetails) {
        // Add testDetails to condition
        try {
          const serverState = await dispatch(
            fetchTestStatus({
              studentId,
              testId: Number(testId),
              isSubmitted: false,
            })
          ).unwrap();

          const testDuration = testDetails.time_duration * 60;
          const initialTime = serverState.remainingTime || testDuration;
          const safeTime = Math.min(initialTime, testDuration);

          dispatch({ type: "test/setInitialTime", payload: safeTime });
        } catch (error) {
          console.error("Initialization failed:", error);
        }
      }
    };
    initializeTest().then(r => console.log(r));
  }, [dispatch, testId, studentId, testDetails]);

  useEffect(() => {
    if (!studentId || !testId || isTestSubmitted) return;

    // Start local timer
    const timerId = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    // Sync with server every 30 seconds
    const syncInterval = setInterval(async () => {
      try {
        const currentTime = store.getState().test.remainingTime;
        const token = store.getState().auth.token; // Get fresh token each time

        // Correct axios call structure
        await axios.post(
            'https://tpc-aptitude-portal-backend.onrender.com/api/test/handle-test', // Use correct endpoint
            { // Request body
              studentId,
              testId: Number(testId),
              remainingTime: currentTime,
              isSubmitted: false,
            },
            { // Config object
              headers: {
                Authorization: `Bearer ${token}`, // Add Bearer prefix
              },
            }
        );
        console.log(`Synced ${currentTime} with server`);
      } catch (error) {
        console.error("Sync failed:", error);
      }
    }, 30000);
    return () => {
      clearInterval(timerId);
      clearInterval(syncInterval);
    };
  }, [studentId, testId, isTestSubmitted, dispatch]);
  useEffect(() => {
    if (remainingTime !== null && remainingTime > 0) {
      const expectedTime = testDetails?.time_duration * 60;
      if (remainingTime >= expectedTime) {
        console.log("Resetting timer from server value");
        dispatch({ type: "test/setInitialTime", payload: remainingTime });
      }
    }
  }, [remainingTime, testDetails?.time_duration, dispatch]);

  // Timer management
  useEffect(() => {
    if (isTestSubmitted || !remainingTime || remainingTime <= 0) return;

    const timerId = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime, isTestSubmitted, dispatch]);

  const handlePracticeSubmit = async (id: any) => {
    dispatch(
      fetchTestStatus({
        studentId,
        testId: Number(testId),
        isSubmitted: true,
      })
    ).unwrap();
    navigate(`/practice-result/${id}`, { state: { answers, testDetails } });
  };

  // Handle test submission
  const handleSubmit = useCallback(async () => {
    if (isTestSubmitted) return;

    try {
      const timeTaken =
        (testDetails?.time_duration || 0) * 60 - (remainingTime ?? 0);

      // Transform answers
      const responses = Object.entries(answers).reduce(
        (acc, [index, optionId]) => {
          const question = questions[Number(index)];
          if (question) {
            acc[question.question_id] = optionId;
          }
          return acc;
        },
        {} as Record<number, number>
      );

      const payload = {
        test_id: Number(testId),
        answers: responses,
      };

      console.log("Submitting Test Payload:", payload);

      // 🚀 Check API call success
      const submitResponse = await dispatch(submitTest(payload)).unwrap();
      console.log("Test Submission Successful:", submitResponse);

      // 🚀 Handle fetch test status separately
      const testStatusResponse = await dispatch(
        fetchTestStatus({
          studentId,
          testId: Number(testId),
          isSubmitted: true,
        })
      ).unwrap();

      console.log("Test Status Updated:", testStatusResponse);

      // Navigate to results or dashboard
      navigate(
        testDetails?.quickEvaluation ? `/result/${testId}` : "/dashboard",
        {
          state: testDetails?.quickEvaluation
            ? {
              testId: Number(testId),
              answers,
              remainingTime: remainingTime ?? 0,
              timeTaken,
              testDetails,
              questions,
            }
            : undefined,
        }
      );
    } catch (err) {
      console.error("Submission failed:", err);

      if (err instanceof Error) {
        if ((err as any).response) {
          console.error("Server Response:", {
            data: (err as any).response.data,
            status: (err as any).response.status,
            headers: (err as any).response.headers,
          });
          console.log(
            (err as any).response.data.message || "Submission failed"
          );
        } else {
          console.error("Error Message:", err.message);
        }
      } else {
        console.error("Unknown error:", err);
      }
    }
  }, [
    isTestSubmitted,
    dispatch,
    testId,
    studentId,
    answers,
    remainingTime,
    testDetails,
    navigate,
    questions,
  ]);

  const enterFullScreen = useCallback(() => {
    const elem = document.documentElement;
    if (!fullScreenRef.current) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
          .then(() => {
            fullScreenRef.current = true;
            escapeAttemptRef.current = 0;
          })
          .catch(err => {
            console.error(`Error enabling fullscreen: ${err.message}`);
          });
      }
    }
  }, []);

  const exitFullScreen = useCallback(() => {
    if (document.exitFullscreen && fullScreenRef.current && isTestSubmitted) {
      document.exitFullscreen()
        .then(() => {
          fullScreenRef.current = false;
        })
        .catch(err => {
          console.error(`Error exiting fullscreen: ${err.message}`);
        });
    }
  }, [isTestSubmitted]);

  const blockEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && !isTestSubmitted) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Re-enter fullscreen if somehow exited
      if (!document.fullscreenElement) {
        enterFullScreen();
      }

      // Show warning after multiple attempts
      escapeAttemptRef.current += 1;
      if (escapeAttemptRef.current > 2) {
        alert("The Escape key is disabled during the test. Please complete the test first.");
      }
      return false;
    }
  }, [enterFullScreen, isTestSubmitted]);

  useEffect(() => {
    // Use capture phase and make non-passive to ensure we catch it first
    const options = { capture: true, passive: false };

    window.addEventListener('keydown', blockEscapeKey, options);

    return () => {
      window.removeEventListener('keydown', blockEscapeKey, options);
    };
  }, [blockEscapeKey]);


  useEffect(() => {
    enterFullScreen();

    return () => {
      exitFullScreen();
    };
  }, [enterFullScreen, exitFullScreen]);

  useEffect(() => {
    if (isTestSubmitted) {
      exitFullScreen();
    }
  }, [isTestSubmitted, exitFullScreen]);

  const disableInspect = useCallback((e: MouseEvent | KeyboardEvent) => {
    // Block right-click
    if (e instanceof MouseEvent && e.button === 2) {
      e.preventDefault();
      return false;
    }

    // Block keyboard shortcuts
    if (e instanceof KeyboardEvent) {

      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      const forbiddenKeys = [
        "F12", "F8", "F7", "ContextMenu",
        "c", "C", "I", "i", "J", "j"
      ];
      const ctrlShiftCombos = ["I", "C", "J", "j", "i", "c"];

      // Block specific keys
      if (forbiddenKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }

      // Block Ctrl+Shift combinations
      if (e.ctrlKey && e.shiftKey && ctrlShiftCombos.includes(e.key)) {
        e.preventDefault();
        return false;
      }

      // Block Alt+Tab, Ctrl+Tab, etc.
      if (e.altKey || e.ctrlKey) {
        if (["Tab", "F4"].includes(e.key)) {
          e.preventDefault();
          return false;
        }
      }

      // Block Windows key (Meta key) combinations
      if (e.metaKey) {
        e.preventDefault();
        return false;
      }
    }
  }, []);

  useEffect(() => {
    // Add all event listeners
    window.addEventListener("contextmenu", disableInspect);
    window.addEventListener("keydown", disableInspect);

    // Block keyboard events on input elements
    const inputElements = document.querySelectorAll('input, textarea, [contenteditable="true"]');
    inputElements.forEach(el => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      el.addEventListener('keydown', disableInspect);
    });

    // Cleanup function
    return () => {
      window.removeEventListener("contextmenu", disableInspect);
      window.removeEventListener("keydown", disableInspect);

      inputElements.forEach(el => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        el.removeEventListener('keydown', disableInspect);
      });
    };
  }, [disableInspect]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isTestSubmitted) {
        e.preventDefault();
        alert("Are you sure you want to leave? Your test progress may be lost."); // Optional alert
        e.preventDefault(); // Ensures the event is triggered
      }
    };


    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTestSubmitted]);

  useEffect(() => {
    // Disable right-click and keyboard shortcuts
    const disableInspect = (e: MouseEvent | KeyboardEvent) => {
      // Block right-click
      if (e instanceof MouseEvent && e.button === 2) {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        Toaster('Right-click is disabled during the test.');
        return false;
      }

      // Block keyboard shortcuts
      if (e instanceof KeyboardEvent) {
        const forbiddenKeys = [
          "F12",
          "F8",
          "F7",
          "ContextMenu",
          "c",
          "C",
          "I",
          "i",
          "J",
          "j",
        ];
        const ctrlShiftCombos = ["I", "C", "J", "j", "i", "c"];

        if (
          forbiddenKeys.includes(e.key) ||
          (e.ctrlKey && e.shiftKey && ctrlShiftCombos.includes(e.key))
        ) {
          e.preventDefault();
          Toaster(<>This action is disabled during test</>);
          return false;
        }

        // Block Alt+Tab, Ctrl+Tab, etc.
        if (e.altKey || e.ctrlKey) {
          if (["Tab", "F4"].includes(e.key)) {
            e.preventDefault();
            Toaster(<>Tab switching is disabled during the test</>);
            return false;
          }
        }
      }
    };


    // Add all event listeners
    window.addEventListener("contextmenu", disableInspect);
    window.addEventListener("keydown", disableInspect);
    // Cleanup function
    return () => {
      window.removeEventListener("contextmenu", disableInspect);
      window.removeEventListener("keydown", disableInspect);
    };
  }, [handleSubmit, testDetails?.strictMode]); // Add dependencies


  // Auto-submit when time reaches 0
  useEffect(() => {
    if (remainingTime === 0 && !isTestSubmitted) {
      handleSubmit().then(r => console.log(r));
    }
  }, [remainingTime, isTestSubmitted, handleSubmit]);

  // Redirect if test submitted
  useEffect(() => {
    if (isTestSubmitted) {
      navigate(`/result/${testId}`);
    }
  }, [isTestSubmitted, navigate, testId]);

  // Helper functions
  const toggleMarkForReview = useCallback(() => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  }, [currentQuestionIndex]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);
  // Loading states
  if (loading) return (
    <div className="w-full p-6 space-y-6">
      {/* Progress Bar Skeleton */}
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-zinc-700 w-full animate-pulse"></div>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 p-4 bg-gray-100 dark:bg-zinc-950 rounded-md">
        <div className="h-6 bg-gray-300 rounded-md dark:bg-zinc-700 w-1/4"></div>
        <div className="flex gap-4">
          <div className="h-8 w-24 bg-gray-300 rounded-md dark:bg-zinc-700"></div>
          <div className="h-8 w-24 bg-gray-300 rounded-md dark:bg-zinc-700"></div>
        </div>
      </div>

      {/* Question Navigation Skeleton */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-8 w-8 bg-gray-200 rounded-full dark:bg-zinc-700 animate-pulse"></div>
        ))}
      </div>

      {/* Separator Skeleton */}
      <div className="h-px bg-gray-200 dark:bg-zinc-700 w-full"></div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Card Skeleton */}
        <div className="h-[400px] bg-gray-100 dark:bg-zinc-900 rounded-xl p-6">
          <div className="h-6 bg-gray-300 rounded-md dark:bg-zinc-700 w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg dark:bg-zinc-800 animate-pulse"></div>
        </div>

        {/* Options Card Skeleton */}
        <div className="h-[400px] bg-gray-100 dark:bg-zinc-900 rounded-xl p-6">
          <div className="h-6 bg-gray-300 rounded-md dark:bg-zinc-700 w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-md dark:bg-zinc-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls Skeleton */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-300 rounded-md dark:bg-zinc-700"></div>
          <div className="h-10 w-36 bg-gray-300 rounded-md dark:bg-zinc-700"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-20 bg-gray-300 rounded-md dark:bg-zinc-700"></div>
          <div className="h-10 w-32 bg-gray-300 rounded-md dark:bg-zinc-700"></div>
        </div>
      </div>

    </div>
  );

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm font-medium">{(error as any).message || error}</p>
      </Alert>
    );
  }
  if (!questions.length) return <p>No questions available.</p>;

  const question = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full p-6 space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-zinc-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Test Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-100 dark:bg-zinc-950 rounded-md shadow">
        <h2 className="text-xl font-bold text-black dark:text-gray-200">
          {testDetails?.test_name || "Test"}
        </h2>
        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="outline" className="text-black dark:text-gray-200">
            Total: {questions.length} Qs
          </Badge>
          <Badge variant="outline" className="text-black dark:text-gray-200">
            Duration: {testDetails?.time_duration} mins
          </Badge>
          <Badge
            variant="destructive"
            className="flex items-center gap-2 animate-pulse"
          >
            <Clock className="w-4 h-4" />
            {formatTime(remainingTime ?? 0)}
          </Badge>
        </div>
      </div>

      {/* Question Navigation Grid */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-4">
        {questions.map((_, index) => (
          <Button
            key={index}
            variant={currentQuestionIndex === index ? "default" : "outline"}
            size="sm"
            className={`h-8 w-8 p-0 rounded-full transition-all relative ${answers[index]
                ? "bg-green-400 hover:bg-green-200 dark:bg-green-600 dark:hover:bg-green-800"
                : ""
              }`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
            {markedQuestions.has(index) && (
              <div className="absolute -top-1 -right-1">
                <Flag className="w-4 h-4 text-red-600 fill-red-600" />
              </div>
            )}
          </Button>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Question & Options Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full min-h-[400px] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Question {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[calc(100%-80px)] overflow-y-auto max-h-[60vh]">
            {question.question_image_url ? (
              <img
                src={question.question_image_url}
                alt="Question"
                className="max-w-full max-h-[300px] object-contain rounded-lg shadow-md"
              />
            ) : (
                <div className="w-full p-4">
                  {question.question_text.startsWith('```') ? (
                      <SyntaxHighlighter
                          language="javascript"
                          style={atomOneDark}
                          className="rounded-lg p-4 text-sm max-h-[500px] overflow-y-auto"
                      >
                        {question.question_text.replace(/```\w*/g, '')}
                      </SyntaxHighlighter>
                  ) : (
                      <pre className="text-lg whitespace-pre-wrap font-sans">
          {question.question_text}
        </pre>
                  )}
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full min-h-[400px] transition-all duration-300">
          <CardHeader>
            <CardTitle>Select your answer</CardTitle>
           <p className="text-[10px] text-gray-400">*Double tap on options to focus the image</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option: any) => (
              <Button
                key={option.option_id}
                variant={
                  answers[currentQuestionIndex] === option.option_id
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  setAnswers((prev) => {
                    const currentAnswer = prev[currentQuestionIndex];
                    // Toggle selection if clicking the same option
                    if (currentAnswer === option.option_id) {
                      const newAnswers = { ...prev };
                      delete newAnswers[currentQuestionIndex];
                      return newAnswers;
                    }
                    // Select new option
                    return {
                      ...prev,
                      [currentQuestionIndex]: option.option_id,
                    };
                  });
                }}
                className="h-24 flex flex-col items-center justify-center relative overflow-hidden group"
              >
                {answers[currentQuestionIndex] === option.option_id && (
                  <Check className="w-6 h-6 absolute top-2 right-2 text-white dark:text-black" />
                )}
                {option.option_image_url ? (
                    <div className="relative w-full h-full">
                      <img
                          src={option.option_image_url}
                          alt="Option"
                          className="w-full h-full object-contain p-2 cursor-zoom-in"
                          onDoubleClick={() => setEnlargedImage({
                            url: option.option_image_url,
                            optionText: option.option_text
                          })}
                      />
                      {option.option_text ? (
                          <div className="w-full h-full overflow-y-auto p-2">
                            {option.option_text.startsWith('```') ? (
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={atomOneDark}
                                    className="rounded-lg p-2 text-xs max-h-[200px]"
                                >
                                  {option.option_text.replace(/```\w*/g, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <pre className="whitespace-pre-wrap text-sm max-h-[200px] overflow-y-auto font-mono">
        {option.option_text}
      </pre>
                            )}
                          </div>
                      ) : null}
                    </div>
                ) : (
                    <span className="text-center break-words px-4">
          {option.option_text}
        </span>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="mr-2" /> Previous
          </Button>
          <Button
            variant={
              markedQuestions.has(currentQuestionIndex)
                ? "destructive"
                : "outline"
            }
            onClick={toggleMarkForReview}
            className="w-full sm:w-auto"
          >
            <Flag className="w-4 h-4 mr-2" />
            {markedQuestions.has(currentQuestionIndex)
              ? "Unmark Review"
              : "Mark for Review"}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
          {isLastQuestion ? (
            <Button
              onClick={
                testDetails.quickEvaluation
                  ? () => {
                    handlePracticeSubmit(testDetails.test_id).then(r => console.log(r));
                  }
                  : handleSubmit
              }
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              Submit Test
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              disabled={isLastQuestion}
              className="w-full sm:w-auto"
            >
              Next Question <ChevronRight className="ml-2" />
            </Button>
          )}
        </div>
      </div>
      {enlargedImage && (
          <div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center cursor-zoom-out"
              onClick={() => setEnlargedImage(null)}
          >
            <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center">
              <img
                  src={enlargedImage.url}
                  alt="Enlarged option"
                  className="object-contain max-h-[80vh]"
              />
              {enlargedImage.optionText && (
                  <p className="mt-4 text-lg text-white bg-black/50 px-4 py-2 rounded-lg">
                    {enlargedImage.optionText}
                  </p>
              )}
            </div>
          </div>
      )}
    </div>
  );
};

export default TestInterface;
