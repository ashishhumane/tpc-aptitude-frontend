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

type Test = {
  _id: string;
  name: string;
  isListed: boolean;
  isQuickEvaluation: boolean;
};

const TestManagement = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    async function getTests() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/test/admin/get-tests`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const transformedTests = response.data.tests.map((test: any) => ({
            ...test,
            isQuickEvaluation: test.quickEvaluation,
          }));

          setTests(transformedTests);
          setFilteredTests(transformedTests);
          toast.success("Tests loaded.");
        } else {
          toast.error("Failed to fetch tests");
        }
      } catch (error: any) {
        toast.error("Something went wrong");
        console.error(error.message);
      }
    }

    getTests();
  }, [token]);

  useEffect(() => {
    if (filterType === "all") {
      setFilteredTests(tests);
    } else if (filterType === "practice") {
      setFilteredTests(tests.filter((t) => t.isQuickEvaluation));
    } else {
      setFilteredTests(tests.filter((t) => !t.isQuickEvaluation));
    }
  }, [filterType, tests]);

  const deleteTest = async () => {
    if (!deleteId) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/test/admin/delete-test/`,
        { testId: deleteId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setTests((prev) => prev.filter((t) => t._id !== deleteId));
        toast.success("Test deleted successfully");
      } else {
        toast.error("Failed to delete test");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
      console.error(error.message);
    } finally {
      setDeleteId(null);
    }
  };

  const toggleIsListed = async (id: string, currentValue: boolean) => {
    const updatedValue = !currentValue;

    setTests((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, isListed: updatedValue } : t
      )
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/test/admin/update-isListed`,
        { testId: id, is_listed: updatedValue },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Test listing updated.");
      } else {
        toast.error("Failed to update listing.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
      console.error(error.message);
    }
  };

  const columns: ColumnDef<Test>[] = [
    {
      header: "ID",
      cell: ({ row }) => row.index + 1, // Serial number instead of Mongo ID
    },
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
            toggleIsListed(row.original._id, row.original.isListed)
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
              onClick={() => setDeleteId(row.original._id)}
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
              <AlertDialogAction onClick={deleteTest}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredTests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Test Management</h2>

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
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
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
