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

  // "responses" is the DB field: { [questionId]: selectedOptionId }
  // "answers" is what the quiz component passed via router state
  // Merge both so either source works
  const responses: Record<string, string> = {
    ...(resultData.responses || {}),
    ...answers,
  };

  useEffect(() => {
    console.log("=== DEBUG ===");
    console.log("location.state:", location.state);
    console.log("answers:", answers);
    console.log("resultData:", resultData);
    console.log("responses (merged):", responses);
    console.log("questions count:", questions.length);
    if (questions.length > 0) {
      console.log("sample question:", questions[0]);
      console.log("sample options:", questions[0]?.options);
    }
  }, []);

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
      const qId = question._id?.toString();

      // Try every possible key format
      const optionId =
        responses[qId] ??               // { questionId: optionId }  <- DB "responses" shape
        responses[index] ??              // { 0: optionId }           <- numeric index
        responses[index.toString()] ??   // { "0": optionId }         <- string index
        null;

      const correctOption = question.options?.find(
        (opt: any) => opt.isCorrect === true
      );

      const selected = question.options?.find(
        (opt: any) => opt._id?.toString() === optionId?.toString()
      );

      const isAnswered = optionId !== null && optionId !== undefined;

      return {
        questionId: qId,
        questionText: question.text,
        selectedOption: isAnswered
          ? selected?.text ?? `Unknown (id: ${optionId})`
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

  // Use DB score as fallback if frontend evaluation gives 0
  const displayScore = score > 0 ? score : (resultData.score ?? 0);

  return (
    <div className="w-full p-6" ref={resultRef}>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {testDetails.test_name || "Test"} Results
          </CardTitle>

          <CardDescription className="flex justify-center lg:space-x-24 lg:mt-10">
            <p>{testDetails.description}</p>
            <p className="font-semibold">
              Duration: {testDetails?.testDetails?.time_duration} mins
            </p>
            <p>Questions: {questions.length}</p>
            <p>Score: {displayScore}</p>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Temporary debug panel - remove after confirming fix */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4 p-3 bg-yellow-100 text-black rounded text-xs font-mono">
              <p><strong>DEBUG</strong></p>
              <p>answers keys: {JSON.stringify(Object.keys(answers))}</p>
              <p>responses keys: {JSON.stringify(Object.keys(responses))}</p>
              <p>questions[0]._id: {questions[0]?._id?.toString()}</p>
              <p>resultData.score (from DB): {resultData.score}</p>
            </div>
          )}

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
