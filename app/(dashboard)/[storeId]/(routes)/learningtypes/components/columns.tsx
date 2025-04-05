"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react"

import { CellAction } from "./cell-action"

export type LearningTypeColumn = {
    id: number;
    type: string;
    description: string;
    createdAt: string;
}
export const columns: ColumnDef<LearningTypeColumn>[] = [
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }: { row: { original: LearningTypeColumn } }): ReactNode => (
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
        cell: ({ row }: { row: { original: LearningTypeColumn } }): ReactNode => <CellAction data={row.original} />,
    },
];
