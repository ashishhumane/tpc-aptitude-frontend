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

  const answers = location.state?.answers || {};       // { [index]: option_id }
  const testDetails = location.state?.testDetails || {};
  const questions = location.state?.questions || [];   // full questions array from Redux

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

  const evaluateResults = () => {
    if (!questions.length) return [];

    return questions.map((question: any, index: number) => {
      // answers are keyed by index, value is option_id (from the quiz component)
      const selectedOptionId =
        answers[index] ?? answers[index.toString()] ?? null;

      // In quiz component options use option_id and option_text (not _id / text)
      const correctOption = question.options?.find(
        (opt: any) => opt.isCorrect === true
      );

      const selectedOption = question.options?.find(
        (opt: any) =>
          opt.option_id === selectedOptionId ||
          opt.option_id?.toString() === selectedOptionId?.toString()
      );

      const isAnswered = selectedOptionId !== null && selectedOptionId !== undefined;

      const isCorrect =
        isAnswered &&
        !!correctOption &&
        (correctOption.option_id === selectedOptionId ||
          correctOption.option_id?.toString() === selectedOptionId?.toString());

      return {
        questionId: question._id ?? index,
        questionText: question.question_text || question.text || "",
        selectedOption: isAnswered
          ? selectedOption?.option_text ?? selectedOption?.text ?? `id: ${selectedOptionId}`
          : "Not Answered",
        correctOption:
          correctOption?.option_text ?? correctOption?.text ?? "N/A",
        isCorrect,
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
              Duration: {testDetails?.testDetails?.time_duration ?? testDetails?.time_duration} mins
            </p>
            <p>Questions: {questions.length}</p>
            <p>Score: {score} / {questions.length}</p>
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