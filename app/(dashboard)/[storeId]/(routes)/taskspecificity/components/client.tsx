"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { TaskSpecificityColumn, columns } from "./columns";

interface TaskSpecificityClientProps {
  data: TaskSpecificityColumn[];
}

export const TaskSpecificityClient: React.FC<TaskSpecificityClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Task Specificities (${data.length})`} description="Manage task specificities for your AI models" />
        <Button onClick={() => router.push(`/${params.storeId}/taskSpecificity/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Task Specificities" />
      <Separator />
      <ApiList entityName="taskSpecificity" entityIdName="taskSpecificityId" />
    </>
  );
};