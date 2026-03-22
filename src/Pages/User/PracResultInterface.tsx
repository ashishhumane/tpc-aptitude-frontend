import { useRef } from "react";
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

  const answers = location.state?.answers || {};       // { [index]: optionId }
  const testDetails = location.state?.testDetails || {};
  const questions = location.state?.questions || [];   // questions from Redux (has question_id, option_id)
  const resultData = location.state?.resultData || {}; // API response (has questions[].options[]._id)

  // resultData.questions use _id fields (same shape as ResultInterface)
  // answers use index keys but values are option _ids
  // We need to build a responses map: { question._id -> selected option._id }
  // We do this by matching answers[index] against resultData.questions[index]
  const buildResponses = (): Record<string, string> => {
    const apiQuestions = resultData.questions || [];
    const responses: Record<string, string> = {};

    apiQuestions.forEach((q: any, index: number) => {
      const selectedOptionId =
        answers[index] ?? answers[index.toString()] ?? null;
      if (selectedOptionId) {
        responses[q._id] = selectedOptionId;
      }
    });

    return responses;
  };

  const responses = buildResponses();

  const handleDownloadResult = () => {
    if (resultRef.current) {
      html2canvas(resultRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${testDetails.test_name || "test"}-result.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  // Same logic as ResultInterface.tsx
  const evaluateResults = () => {
    const apiQuestions = resultData.questions || [];
    if (!apiQuestions.length) return [];

    return apiQuestions.map((q: any, index: number) => {
      const attemptedAnswerId = responses[q._id]; // { questionId -> optionId }

      const attemptedOption = q.options?.find(
        (opt: any) => opt._id === attemptedAnswerId
      );
      const correctOption = q.options?.find((opt: any) => opt.isCorrect);

      const isAnswered = !!attemptedAnswerId;

      return {
        index,
        questionId: q._id,
        questionText: q.text || "",
        selectedOption: isAnswered
          ? attemptedOption?.text ?? "Unknown Option"
          : "Not Answered",
        correctOption: correctOption?.text || "N/A",
        isCorrect: isAnswered && (attemptedOption?.isCorrect === true),
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
            {testDetails.test_name || "Test"} Results
          </CardTitle>

          <CardDescription className="flex justify-center lg:space-x-24 lg:mt-10 flex-wrap gap-2">
            <p>{testDetails.description}</p>
            <p className="font-semibold">
              Duration:{" "}
              {testDetails?.testDetails?.time_duration ?? testDetails?.time_duration}{" "}
              mins
            </p>
            <p>Questions: {results.length}</p>
            <p>
              Score: {score} / {results.length}
            </p>
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