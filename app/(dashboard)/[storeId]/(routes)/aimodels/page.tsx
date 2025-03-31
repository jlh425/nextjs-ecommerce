import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import { AiModelColumn } from "./components/columns"
import { AiModelClient } from "./components/client";

const AiModelsPage = async ({
  params
}: {
  params: { storeId: number }
}) => {
  const aiModels = await prismadb.aIModel.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedAiModels: AiModelColumn[] = aiModels.map((item) => ({
    id: Number(item.id),
    name: item.name,
    description: item.description || "",
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AiModelClient data={formattedAiModels} />
      </div>
    </div>
  );
};
export default AiModelsPage;