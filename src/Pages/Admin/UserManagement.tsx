"use client";

import { useState } from "react";
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
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define student data type
type Student = {
  id: number;
  name: string;
  gender: string;
  dateOfJoining: string;
  performance: string;
};

// Sample student data
const initialStudents: Student[] = [
  {
    id: 1,
    name: "Amit Sharma",
    gender: "Male",
    dateOfJoining: "2023-08-15",
    performance: "Good",
  },
  {
    id: 2,
    name: "Neha Verma",
    gender: "Female",
    dateOfJoining: "2022-05-20",
    performance: "Excellent",
  },
  {
    id: 3,
    name: "Rohit Mehta",
    gender: "Male",
    dateOfJoining: "2021-12-10",
    performance: "Average",
  },
  {
    id: 4,
    name: "Priya Singh",
    gender: "Female",
    dateOfJoining: "2024-01-05",
    performance: "Poor",
  },
  {
    id: 5,
    name: "Karan Patel",
    gender: "Male",
    dateOfJoining: "2020-07-18",
    performance: "Good",
  },
];

const UserManagement = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  // Update Performance
  const updatePerformance = (id: number, newPerformance: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id
          ? { ...student, performance: newPerformance }
          : student
      )
    );
  };

  // Delete Student
  const deleteStudent = (id: number) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );
  };

  // Define table columns
  const columns: ColumnDef<Student>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Student Name" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "dateOfJoining", header: "Date of Joining" },
    {
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => (
        <Select
          onValueChange={(value) => updatePerformance(row.original.id, value)}
          defaultValue={row.original.performance}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Average">Average</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteStudent(row.original.id)}
        >
          <Trash2 size={16} />
        </Button>
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <div className="w-full max-w-6xl mx-auto">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-2 text-left">
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
                      <TableCell key={cell.id} className="px-4 py-2">
                        {typeof cell.column.columnDef.cell === "function"
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.renderValue()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-4"
                  >
                    No students available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
