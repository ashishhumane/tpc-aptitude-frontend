import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUnlistedTests,
  publishResult,
  unpublishResult,
} from "../../../store/Actions/adminAction";
import { AppDispatch, RootState } from "../../../store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Importing Sonner (ShadCN)

const ResultManage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tests = [], isLoading, error } = useSelector(
    (state: RootState) => state.admin || { tests: [] }
  );

  useEffect(() => {
    dispatch(getUnlistedTests());
  }, [dispatch]);

  const handlePublish = async (testId: number) => {
    await dispatch(publishResult(testId));
    toast.success("Test published successfully!", {
      position: "top-right",
      duration: 3000,
    });
    dispatch(getUnlistedTests());
  };

  const handleUnpublish = async (testId: number) => {
    await dispatch(unpublishResult(testId));
    toast.warning("Test unpublished successfully!", {
      position: "top-right",
      duration: 3000,
    });
    dispatch(getUnlistedTests());
  };

  return (
    <div className="w-full h-[44vh] p-4">
      <h2 className="text-xl font-bold mb-4">Test Results Management</h2>
      {isLoading ? (
        <p>Loading tests...</p>
      ) : error ? (
        <p className="text-red-500">
          {typeof error === "string" ? error : error?.message}
        </p>
      ) : tests.length === 0 ? (
        <p>No tests available.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test: any) => (
              <TableRow key={test.id}>
                <TableCell>{test.id}</TableCell>
                <TableCell>{test.name}</TableCell>
                <TableCell>
                  {test.resultPublished ? (
                    <Badge variant="default">Published</Badge>
                  ) : (
                    <Badge variant="destructive">Unpublished</Badge>
                  )}
                </TableCell>
                <TableCell className="space-x-2">
                  {test.resultPublished ? (
                    <Button
                      variant="outline"
                      onClick={() => handleUnpublish(test._id)}
                    >
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => handlePublish(test._id)}
                    >
                      Publish
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ResultManage;
