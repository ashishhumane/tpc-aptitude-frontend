import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PracResultInterface = () => {
  const location = useLocation();
  const resultRef = useRef<HTMLDivElement>(null);

  const answers = location.state?.answers || {};
  const testDetails = location.state?.testDetails || {};
  const resultData = location.state?.resultData || {};

  const questions = resultData.questions || [];

  useEffect(() => {
    console.log("ANSWERS:", answers);
    console.log("ANSWER KEYS:", Object.keys(answers));
    console.log("QUESTIONS:", questions);
    if (questions.length > 0) {
      console.log("FIRST QUESTION _id:", questions[0]?._id);
    }
  }, [answers, questions]);

  const handleDownloadResult = () => {
    if (resultRef.current) {
      html2canvas(resultRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${testDetails.test_name}-result.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const evaluateResults = () => {
    if (!questions.length) return [];

    return questions.map((question: any, index: number) => {
      // Try all possible key formats: number index, string index, and question._id
      const optionId =
        answers[index] ??
        answers[index.toString()] ??
        answers[question._id] ??
        null;

      const correctOption = question.options.find(
        (opt: any) => opt.isCorrect === true
      );

      // Normalize both sides to string for safe comparison
      const selected = question.options.find(
        (opt: any) =>
          opt._id === optionId ||
          opt._id?.toString() === optionId?.toString()
      );

      const isAnswered = optionId !== null && optionId !== undefined;

      return {
        questionId: question._id,
        questionText: question.text,
        selectedOption: isAnswered
          ? selected?.text ?? "Unknown Option"
          : "Not Answered",
        correctOption: correctOption?.text || "N/A",
        isCorrect:
          isAnswered &&
          !!correctOption &&
          correctOption._id?.toString() === optionId?.toString(),
        isAnswered,
      };
    });
  };

  const results = evaluateResults();

  const score = results.filter((r: any) => r.isCorrect).length;

  return (
    <div className="w-full p-6" ref={resultRef}>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {testDetails.test_name} Results
          </CardTitle>

          <CardDescription className="flex justify-center lg:space-x-24 lg:mt-10">
            <p>{testDetails.description}</p>
            <p className="font-semibold">
              Duration: {testDetails?.testDetails?.time_duration} mins
            </p>
            <p>Questions: {questions.length}</p>
            <p>Score: {score}</p>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Your Answer</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {results.map((res: any, idx: number) => (
                  <TableRow key={res.questionId}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{res.questionText}</TableCell>
                    <TableCell>{res.selectedOption}</TableCell>
                    <TableCell>{res.correctOption}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          !res.isAnswered
                            ? "secondary"
                            : res.isCorrect
                              ? "default"
                              : "destructive"
                        }
                      >
                        {!res.isAnswered
                          ? "Not Answered"
                          : res.isCorrect
                            ? "Correct"
                            : "Incorrect"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto mt-4">
        <Button className="w-full" onClick={handleDownloadResult}>
          Download Result as Image
        </Button>
      </div>
    </div>
  );
};

export default PracResultInterface;