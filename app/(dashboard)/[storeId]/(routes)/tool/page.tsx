import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ToolColumn } from "./components/columns";
import { ToolClient } from "./components/client";

const ToolPage = async ({
  params
}: {
  params: { storeId: number }
}) => {
  const tools = await prismadb.tool.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedTools: ToolColumn[] = tools.map((item) => ({
    id: Number(item.id),
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ToolClient data={formattedTools} />
      </div>
    </div>
  );
};

export default ToolPage;
