"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react"

import { CellAction } from "./cell-action"

export type TaskSpecificityColumn = {
  id: number;
  type: string;
  description: string;
  createdAt: string;
}

export const columns: ColumnDef<TaskSpecificityColumn>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }: { row: { original: TaskSpecificityColumn } }): ReactNode => (
        <div className="flex items-center gap-x-2">
            {row.original.description}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.description }} />
        </div>
    ),
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }: { row: { original: TaskSpecificityColumn } }): ReactNode => <CellAction data={row.original} />,
    },
];
