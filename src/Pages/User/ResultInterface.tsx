import { useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { AppDispatch, RootState } from "../../../store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTestResult } from "../../../store/Actions/resultAction";

const ResultInterface = () => {
  const dispatch = useDispatch<AppDispatch>();
  const resultRef = useRef<HTMLDivElement>(null);
  const { testId } = useParams();
  const student_id = useSelector((state: RootState) => state.auth.user?.userId);
  const user = useSelector((state: RootState) => state.auth.user);

  const { testResult, loading, error } = useSelector(
    (state: RootState) => state.result
  ) as {
    testResult: any;
    loading: boolean;
    error: string | { message: string };
  };

  useEffect(() => {
    if (testId && student_id) {
      dispatch(
        getTestResult({
          test_id: Number(testId),
          student_id: Number(student_id),
        })
      );
    }
  }, [dispatch, testId, student_id]);

  const computedResult = useMemo(() => {
    if (!testResult || !user) return null;

    const testData = testResult;
    const resultData = testResult.results[0];
    const passingScore = testData.totalQuestions * 0.5; // Adjust as per your criteria

    return {
      student: {
        name: user.firstName + " " + user.lastName, // Assuming user has firstName and lastName properties
        rollNumber: "N/A",
        course: "B-TECH ECS",
        year: "3rd Year",
      },
      test: {
        title: testData.name,
        date: new Date(testData.createdAt).toLocaleDateString(),
        totalMarks: testData.totalQuestions,
        obtainedMarks: resultData.score,
        status: resultData.score >= passingScore ? "Passed" : "Failed",
        timeTaken: 0, // Update if you have duration data
      },
      questions: testData.questions.map((q: any) => {
        const attemptedAnswerId = resultData.responses[q.id];
        const attemptedOption = q.options.find(
          (opt: any) => opt.id === attemptedAnswerId
        );
        const correctOption = q.options.find((opt: any) => opt.isCorrect);

        return {
          id: q.id,
          question: q.text,
          attemptedAnswer: attemptedOption?.text || "Not answered",
          correctAnswer: correctOption?.text || "No correct answer",
          isCorrect: attemptedOption ? attemptedOption.isCorrect : false,
        };
      }),
    };
  }, [testResult, user]);

  // Memoize studentData to avoid re-creating the object on every render
  const studentData = useMemo(() => {
    const persistedData = localStorage.getItem("persist:root");
    return persistedData ? JSON.parse(JSON.parse(persistedData).auth) : null;
  }, []);
  console.log(studentData.user);

  const downloadResult = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "Student_Result.png";
      link.click();
    }
  };

  if (loading) return <p className="text-center p-4">Loading results...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center p-4">
        Error: {typeof error === "string" ? error : error.message}
      </p>
    );
  if (!computedResult)
    return <p className="text-center p-4">No results available</p>;

  return (
    <div className="p-6 w-full">
      <div className="flex flex-row items-center justify-between text-center">
        <h1 className="text-3xl font-bold mb-4">📄 Student Result</h1>
        <Button onClick={downloadResult} className="bg-green-600 hover:bg-green-700 text-white">
           Download Result
        </Button>
      </div>

      <div
        ref={resultRef}
        className="bg-white dark:bg-black p-6 rounded-lg shadow-lg border"
      >
        {/* Student Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>Name: {computedResult.student.name}</div>
              <div>Admission Number: {computedResult.student.rollNumber}</div>
              <div>Course: {computedResult.student.course}</div>
              <div>Year: {computedResult.student.year}</div>
            </div>
          </CardContent>
        </Card>

        {/* Test Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>Test Title: {computedResult.test.title}</div>
              <div>Date: {computedResult.test.date}</div>
              <div>Total Marks: {computedResult.test.totalMarks}</div>
              <div>Obtained Marks: {computedResult.test.obtainedMarks}</div>
              <div>
                Status:{" "}
                <Badge
                  className={
                    computedResult.test.status === "Passed"
                      ? "bg-green-600 text-white hover:bg-white-700"
                      : "bg-red-500"
                  }
                >
                  {computedResult.test.status}
                </Badge>
              </div>
              <div>
                Time Taken: {Math.floor(computedResult.test.timeTaken / 60)}m{" "}
                {computedResult.test.timeTaken % 60}s
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Analysis Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-200 dark:bg-zinc-950">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Question</th>
                  <th className="border p-2">Your Answer</th>
                  <th className="border p-2">Correct Answer</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {computedResult.questions.map(
                  (
                    q: {
                      id: number;
                      question: string;
                      attemptedAnswer: string;
                      correctAnswer: string;
                      isCorrect: boolean;
                    },
                    index: number
                  ) => (
                    <tr key={q.id} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2 text-left">{q.question}</td>
                      <td
                        className={`border p-2 ${
                          q.isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {q.attemptedAnswer}
                      </td>
                      <td className="border p-2">{q.correctAnswer}</td>
                      <td className="border p-2">
                        {q.isCorrect ? (
                          <Badge className="bg-green-600 hover:bg-green-700 text-white">
                            Correct
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">
                            Incorrect
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultInterface;
