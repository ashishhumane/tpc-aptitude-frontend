import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { evaluateQuickTest } from "../../../store/Actions/testActions";
import { AppDispatch } from "../../../store/store";
import html2canvas from "html2canvas";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PracResultInterface = () => {
  const location = useLocation();
  const { testId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const resultRef = useRef<HTMLDivElement>(null);

  const { result, loading, error } = useSelector((state: any) => state.test);
  const answers = location.state?.answers || {};
  const testDetails = location.state?.testDetails || {};

  useEffect(() => {
    dispatch(evaluateQuickTest(testId));
  }, [dispatch, testId]);

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
    if (!result?.questions) return [];
    return Object.entries(answers).map(([index, optionId]) => {
      const question = result.questions[parseInt(index)];
      const correctOption = question.options.find((opt: any) => opt.isCorrect);
      return {
        questionId: question.questionId,
        questionText: question.text,
        selectedOption: question.options.find((opt: any) => opt.id === optionId)?.text || "Unknown",
        isCorrect: correctOption?.id === optionId,
        correctOption: correctOption?.text,
      };
    });
  };

  const results = evaluateResults();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardContent>
      </Card>
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-4xl mx-auto">
      <Alert variant="destructive">
        <AlertTitle>Error: {error.message}</AlertTitle>
      </Alert>
    </div>
  );

  return (
    <div className="w-full p-6" ref={resultRef}>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{testDetails.test_name} Results</CardTitle>
          <CardDescription className="flex justify-center lg:space-x-24 lg:mt-10">
            <p>{testDetails.description}</p>
            <p>Duration: {testDetails.time_duration} mins</p>
            <p>Questions: {results.length}</p>
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
                {results.map((res, idx) => (
                  <TableRow key={res.questionId}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{res.questionText}</TableCell>
                    <TableCell>{res.selectedOption}</TableCell>
                    <TableCell>{res.correctOption}</TableCell>
                    <TableCell>
                      <Badge variant={res.isCorrect ? "default" : "destructive"}>
                        {res.isCorrect ? "Correct" : "Incorrect"}
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
