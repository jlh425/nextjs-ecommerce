"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react"

import { CellAction } from "./cell-action"

export type AiModelColumn = {
  id: number;
  name: string;  
  createdAt: string;
}
export const columns: ColumnDef<AiModelColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },  
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }: { row: { original: AiModelColumn } }): ReactNode => <CellAction data={row.original} />,
  },
];