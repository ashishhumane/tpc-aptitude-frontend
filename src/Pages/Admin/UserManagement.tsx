"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { getAllUsers, deleteUser } from "../../../store/Actions/adminAction";
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

// Define the correct User type based on API response
type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; // Date of account creation
};

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get user data from Redux store
  const { users, isLoading, error } = useSelector(
    (state: RootState) => state.admin,
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  console.log(users);

  // Delete User
  const handleDeleteUser = async (id: string) => {
    await dispatch(deleteUser(id));
    dispatch(getAllUsers());
  };

  // Define table columns
  const columns: ColumnDef<User>[] = [
    { accessorKey: "_id", header: "ID" },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      header: "Joined On",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteUser(row.original._id)}
        >
          <Trash2 size={16} />
        </Button>
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data: users, // Use API-fetched users
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      {isLoading && <p>Loading users...</p>}
      {error && (
        <p className="text-red-500">
          Error:{" "}
          {typeof error === "string"
            ? error
            : error.message || "An unknown error occurred"}
        </p>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <div className="w-full max-w-6xl mx-auto">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="px-4 py-2 text-left"
                      >
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
                      No users available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
