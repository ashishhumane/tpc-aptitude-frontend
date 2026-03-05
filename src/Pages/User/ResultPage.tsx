"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAvailableResults } from "../../../store/Actions/resultAction";
import { RootState, AppDispatch } from "../../../store/store";
import { RefreshCw } from "lucide-react";

const ResultPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const student_id = String(
    useSelector((state: RootState) => state.auth.user?.userId)
  );

  const { availableResults, loading, error } = useSelector(
    (state: RootState) => state.result
  ) as {
    availableResults: any[];
    loading: boolean;
    error: string | { message: string } | null;
  };

  // Refetch when component mounts or when navigating back
  useEffect(() => {
    dispatch(getAvailableResults(student_id));
  }, [dispatch, student_id]);
//  console.log("available:",availableResults);
 
  const handleRefresh = () => {
    dispatch(getAvailableResults(student_id));
  };

  const handleSeeResult = (resultId: string) => {
    navigate(`/result/${resultId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Test Results</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {loading && <p className="text-center">Loading results...</p>}
      {error && (
        <p className="text-center text-red-500">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}

      <div className="overflow-x-auto">
        <Table className="w-full border rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-200 dark:bg-zinc-800">
              <TableHead className="p-3">Result ID</TableHead>
              <TableHead className="p-3">Test Name</TableHead>
              <TableHead className="p-3">Description</TableHead>
              <TableHead className="p-3">Total Questions</TableHead>
              <TableHead className="p-3">Time Limit</TableHead>
              <TableHead className="p-3">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {availableResults
              .filter((result: any) => result.testId !== null) // ✅ Filter out unpublished results
              .map((result: any, index: number) => (
              <TableRow key={result._id} className="border-t">
                {/* ✅ Serial Number Instead of Mongo ID */}
                <TableCell className="p-3">{index + 1}</TableCell>

                <TableCell className="p-3">
                  {result.testId?.name}
                </TableCell>

                <TableCell className="p-3">
                  {result.testId?.description}
                </TableCell>

                <TableCell className="p-3">
                  {result.testId?.totalQuestions}
                </TableCell>

                <TableCell className="p-3">
                  {result.testId?.timeLimit} min
                </TableCell>

                <TableCell className="p-3">
                  <Button
                    size="sm"
                    onClick={() => handleSeeResult(result.testId._id)}
                  >
                    See Detailed Result
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {availableResults.filter((result: any) => result.testId !== null).length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No results available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResultPage;
