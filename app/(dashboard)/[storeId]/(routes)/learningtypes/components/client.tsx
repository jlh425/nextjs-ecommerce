"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns } from "./columns";
import { LearningType } from "@prisma/client";

interface LearningTypeColumn {
    id: number;
    type: string;
    description: string;
    createdAt: string;
    }

interface LearningTypeClientProps {
  data: LearningType[];
}

export const LearningTypeClient: React.FC<LearningTypeClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();
    const formattedData: LearningTypeColumn[] = data.map((item) => ({
        id: Number(item.id),
        type: item.type,
        description: item.description || "No description",
        createdAt: item.createdAt.toISOString(),
    }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Learning Types (${data.length})`} description="Manage learning types for your products" />
        <Button onClick={() => router.push(`/${params.storeId}/learningtypes/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={formattedData} />
      <Heading title="API" description="API Calls for Learning Types" />
      <Separator />
      <ApiList entityName="learningtypes" entityIdName="learningTypeId" />
    </>
  );
};