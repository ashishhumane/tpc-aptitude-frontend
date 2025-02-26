"use client"

import  { useState } from "react"
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"

// Define test data type
type Test = {
  id: number
  name: string
  isListed: boolean
  isQuickEvaluation: boolean
}

// Sample test data
const initialTests: Test[] = [
  { id: 1, name: "Aptitude Test", isListed: true, isQuickEvaluation: false },
  { id: 2, name: "Logical Reasoning", isListed: false, isQuickEvaluation: true },
  { id: 3, name: "Verbal Ability", isListed: true, isQuickEvaluation: true },
  { id: 4, name: "Technical Test", isListed: false, isQuickEvaluation: false },
  { id: 5, name: "General Knowledge", isListed: true, isQuickEvaluation: true },
  { id: 6, name: "Coding Challenge", isListed: false, isQuickEvaluation: false },
]

const TestManagement = () => {
  const [tests, setTests] = useState<Test[]>(initialTests)

  // Toggle Quick Evaluation
  const toggleQuickEvaluation = (id: number) => {
    setTests((prevTests) =>
      prevTests.map((test) =>
        test.id === id ? { ...test, isQuickEvaluation: !test.isQuickEvaluation } : test
      )
    )
  }

  // Delete test function
  const deleteTest = (id: number) => {
    setTests((prevTests) => prevTests.filter((test) => test.id !== id))
  }

  // Define table columns
  const columns: ColumnDef<Test>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Test Name" },
    {
      accessorKey: "isListed",
      header: "Listed",
      cell: ({ row }) => (
        <Checkbox checked={row.original.isListed} disabled />
      ),
    },
    {
      accessorKey: "isQuickEvaluation",
      header: "Quick Evaluation",
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.isQuickEvaluation}
          onCheckedChange={() => toggleQuickEvaluation(row.original.id)}
        />
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteTest(row.original.id)}
        >
          <Trash2 size={16} />
        </Button>
      ),
    },
  ]

  // Create table instance
  const table = useReactTable({
    data: tests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Test Management</h2>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{header.column.columnDef.header as string}</TableHead>
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
                    {typeof cell.column.columnDef.cell === 'function' ? cell.column.columnDef.cell(cell.getContext()) : cell.renderValue()}
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
  )
}

export default TestManagement
