import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { getQuestions } from "../../../store/Actions/testActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Calculator,
  Check,
  Clock,
  Flag,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const TestInterface = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { questions, testDetails, loading, error } = useSelector(
    (state: RootState) => state.test
  );
  const { testId } = useParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(
    new Set()
  );

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

  useEffect(() => {
    if (testDetails?.time_duration) {
      setTimeLeft(testDetails.time_duration * 60);
    }
  }, [testDetails]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitted]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (testId) {
      dispatch(getQuestions(Number(testId)));
    }
  }, [dispatch, testId]);

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    navigate(`/result/${testId}`, { state: { answers } });
  }, [isSubmitted, navigate]);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
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
            {formatTime(timeLeft)}
          </Badge>
          <Button
            size="sm"
            variant={calculatorOpen ? "default" : "outline"}
            onClick={() => setCalculatorOpen(!calculatorOpen)}
          >
            <Calculator className="w-5 h-5 mr-1" /> Calculator
          </Button>
        </div>
      </div>

      {/* Question Navigation Grid */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 p-4">
        {questions.map((_, index) => (
          <Button
            key={index}
            variant={currentQuestionIndex === index ? "default" : "outline"}
            size="sm"
            className={`h-8 w-8 p-0 rounded-full transition-all relative ${
              answers[index] !== undefined
                ? "bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
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
        {/* Question Section */}
        <Card className="h-full min-h-[400px] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Question {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[calc(100%-80px)]">
            {question.question_image_url ? (
              <img
                src={question.question_image_url}
                alt="Question"
                className="max-w-full max-h-[300px] object-contain rounded-lg shadow-md"
              />
            ) : (
              <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                {question.question_text}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Options Section */}
        <Card className="h-full min-h-[400px] transition-all duration-300">
          <CardHeader>
            <CardTitle>Select your answer</CardTitle>
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
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestionIndex]: option.option_id,
                  }));
                }}
                className="h-24 flex flex-col items-center justify-center relative overflow-hidden group"
              >
                {answers[currentQuestionIndex] === option.option_id && (
                  <Check className="w-6 h-6 absolute top-2 right-2 text-white dark:text-black" />
                )}
                {option.option_image_url ? (
                  <img
                    src={option.option_image_url}
                    alt="Option"
                    className="w-full h-full object-contain p-2"
                  />
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
              onClick={handleSubmit}
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
    </div>
  );
};

export default TestInterface;
