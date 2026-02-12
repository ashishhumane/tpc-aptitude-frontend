"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

// Define test data type
type Test = {
  id: number;
  name: string;
  isListed: boolean;
  isQuickEvaluation: boolean;
};

// Sample test data
const initialTests: Test[] = [];

const TestManagement = () => {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [filteredTests, setFilteredTests] = useState<Test[]>(initialTests);
  const [filterType, setFilterType] = useState<string>("all"); // Filter state
  const [deleteId, setDeleteId] = useState<number | null>(null); // Store test ID for deletion
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    async function getTests() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/test/admin/get-tests`,
          {
            headers: {
              Authorization: token,
            },
            withCredentials: true,
          },
        );
        if (response.status == 200) {
          // Map API data to match Test type
          const transformedTests = response.data.tests.map((test: any) => ({
            ...test,
            isQuickEvaluation: test.quickEvaluation, // Correct property mapping
          }));
          setTests(transformedTests);
          setFilteredTests(transformedTests);
          toast.success("Tests loaded.");
          
        } else {
          toast.error("Failed to fetch tests");
        }
      } catch (error: any) {
        toast.error("Something went wrong");
        console.log(error.message);
      }
    }
    getTests();
  }, []);

  // Filter tests based on the selected type
  useEffect(() => {
    if (filterType === "all") {
      setFilteredTests(tests);
    } else if (filterType === "practice") {
      setFilteredTests(tests.filter((test) => test.isQuickEvaluation));
    } else if (filterType === "evaluation") {
      setFilteredTests(tests.filter((test) => !test.isQuickEvaluation));
    }
  }, [filterType, tests]);

  // Delete test function with API call
  const deleteTest = async () => {
    if (deleteId !== null) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}api/test/admin/delete-test/`,
          {
            testId: deleteId,
          },
          {
            headers: {
              Authorization: token,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setTests((prevTests) =>
            prevTests.filter((test) => test.id !== deleteId)
          );
          toast.success("Test deleted successfully");
        } else {
          toast.error("Failed to delete test");
        }
      } catch (error: any) {
        toast.error("Something went wrong");
        console.error(error.message);
      } finally {
        setDeleteId(null); // Reset delete ID
      }
    }
  };

  const toggleIsListed = async (id: number, currentValue: boolean) => {
    const updatedValue = !currentValue;
    setTests((prevTests) =>
      prevTests.map((test) =>
        test.id === id ? { ...test, isListed: updatedValue } : test
      )
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/test/admin/update-isListed`,
        { testId: id, is_listed: updatedValue },
        { headers: { Authorization: token }, withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Test listing updated.");
      } else {
        toast.error("Failed to update test listing.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
      console.error(error.message);
    }
  };

  // Define table columns
  const columns: ColumnDef<Test>[] = [
    { accessorKey: "_id", header: "ID" },
    { accessorKey: "name", header: "Test Name" },
    {
      accessorKey: "isQuickEvaluation",
      header: "Test Type",
      cell: ({ row }) =>
        row.original.isQuickEvaluation ? "Practice" : "Evaluation",
    },
    {
      accessorKey: "isListed",
      header: "Listed",
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.isListed}
          onCheckedChange={() =>
            toggleIsListed(row.original.id, row.original.isListed)
          }
        />
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              Are you sure you want to delete this test?
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteTest}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data: filteredTests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Test Management</h2>

      {/* Filter Dropdown */}
      <div className="mb-4 flex items-center space-x-4">
        <span className="text-lg font-medium">Filter By:</span>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Test Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tests</SelectItem>
            <SelectItem value="practice">Practice Tests</SelectItem>
            <SelectItem value="evaluation">Evaluation Tests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.column.columnDef.header as string}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {typeof cell.column.columnDef.cell === "function"
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.renderValue()}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No tests available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TestManagement;
