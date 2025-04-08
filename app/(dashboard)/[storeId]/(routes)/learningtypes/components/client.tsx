"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, LearningTypeColumn } from "./columns";
import { LearningType } from "@prisma/client";


interface LearningTypeClientProps {
  data: LearningTypeColumn[];
}

export const LearningTypeClient: React.FC<LearningTypeClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();
  

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Learning Types (${data.length})`} description="Manage learning types for your products" />
        <Button onClick={() => router.push(`/${params.storeId}/learningtypes/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Learning Types" />
      <Separator />
      <ApiList entityName="learningtypes" entityIdName="learningTypeId" />
    </>
  );
};