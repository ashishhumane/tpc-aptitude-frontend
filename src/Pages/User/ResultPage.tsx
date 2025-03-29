import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAvailableResults } from "../../../store/Actions/resultAction";
import { RootState, AppDispatch } from "../../../store/store";

const ResultPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Block keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Get student_id (Assuming it's stored in Redux or localStorage)
  const student_id = Number(
    useSelector((state: RootState) => state.auth.user?.userId)
  );
  console.log("student_id", student_id);


  // Fetch results from Redux store
  const { availableResults, loading, error } = useSelector(
    (state: RootState) => state.result
  ) as {
    availableResults: any[];
    loading: boolean;
    error: string | { message: string } | null;
  };

  useEffect(() => {
    dispatch(getAvailableResults(student_id));
  }, [dispatch, student_id]);

  const handleSeeResult = (testId: number) => {
    navigate(`/result/${testId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6"> Test Results</h1>

      {/* Loading and Error Handling */}
      {loading && <p className="text-center">Loading results...</p>}
      {error && (
        <p className="text-center text-red-500">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto">
        <Table className="w-full border rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-200 dark:bg-zinc-800">
              <TableHead className="text-left p-3">Result ID</TableHead>
              <TableHead className="text-left p-3">Test Name</TableHead>
              <TableHead className="text-left p-3">Description</TableHead>
              <TableHead className="text-left p-3">Total Questions</TableHead>
              <TableHead className="text-left p-3">Time Limit</TableHead>
              <TableHead className="text-left p-3">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableResults.map((result: any) => (
              <TableRow key={result.id} className="border-t ">
                <TableCell className="p-3">{result.id}</TableCell>
                <TableCell className="p-3">{result.name}</TableCell>
                <TableCell className="p-3">{result.description}</TableCell>
                <TableCell className="p-3">{result.totalQuestions}</TableCell>
                <TableCell className="p-3">{result.timeLimit} min</TableCell>
                <TableCell className="p-3">
                  <Button size="sm" onClick={() => handleSeeResult(result.id)}>
                    See Detailed Result
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResultPage;
