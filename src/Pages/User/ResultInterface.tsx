import { useRef } from "react";
import html2canvas from "html2canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const resultData = {
  student: {
    name: "John Doe",
    rollNumber: "PCE2024-101",
    course: "B.Tech CSE",
    year: "Final Year",
  },
  test: {
    title: "Aptitude Test",
    date: "25th Feb 2025",
    totalMarks: 20,
    obtainedMarks: 18,
    status: "Passed",
  },
  questions: [
    {
      id: 1,
      question: "What is 2 + 2?",
      attemptedAnswer: "4",
      correctAnswer: "4",
      isCorrect: true,
    },
    {
      id: 2,
      question: "What is the capital of France?",
      attemptedAnswer: "Berlin",
      correctAnswer: "Paris",
      isCorrect: false,
    },
    {
      id: 3,
      question: "Solve: 5 x 6",
      attemptedAnswer: "30",
      correctAnswer: "30",
      isCorrect: true,
    },
  ],
};

const ResultInterface = () => {
  const resultRef = useRef(null);

  const downloadResult = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "Student_Result.png";
      link.click();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">📄 Student Result</h1>

      {/* Result Container to Capture for PDF */}
      <div ref={resultRef} className="bg-white dark:bg-black p-6 rounded-lg shadow-lg border">
        {/* Student Details */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Student Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Name:</strong> {resultData.student.name}
            </p>
            <p>
              <strong>Roll Number:</strong> {resultData.student.rollNumber}
            </p>
            <p>
              <strong>Course:</strong> {resultData.student.course}
            </p>
            <p>
              <strong>Year:</strong> {resultData.student.year}
            </p>
          </CardContent>
        </Card>

        {/* Test Details */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Test Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Test Name:</strong> {resultData.test.title}
            </p>
            <p>
              <strong>Date:</strong> {resultData.test.date}
            </p>
            <p>
              <strong>Total Marks:</strong> {resultData.test.totalMarks}
            </p>
            <p>
              <strong>Obtained Marks:</strong> {resultData.test.obtainedMarks}
            </p>
            <p className="col-span-2">
              <Badge
                className={`px-3 py-1 ${
                  resultData.test.status === "Passed"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {resultData.test.status}
              </Badge>
            </p>
          </CardContent>
        </Card>

        {/* Questions & Answers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Question</th>
                  <th className="border p-2">Your Answer</th>
                  <th className="border p-2">Correct Answer</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {resultData.questions.map((q, index) => (
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
                        <Badge className="bg-green-500 text-white">
                          Correct
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500 text-white">
                          Incorrect
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Download Button */}
      <div className="flex justify-center mt-6">
        <Button onClick={downloadResult} className="bg-blue-600 text-white">
          📥 Download Result
        </Button>
      </div>
    </div>
  );
};

export default ResultInterface;
