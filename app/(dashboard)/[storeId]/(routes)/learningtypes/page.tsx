import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { LearningTypeColumn } from "./components/columns";
import { LearningTypeClient } from "./components/client";


const LearningTypesPage = async ({
  params,
}: {
    params: { storeId: number }
}) => {
  const learningTypes = await prismadb.learningType.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedLearningTypes: LearningTypeColumn[] = learningTypes.map((item) => ({
    id: item.id, // Convert bigint to number
    type: item.type,
    description: item.description || "No description", // Handle null description
    createdAt: format(item.createdAt, "MMMM do, yyyy"), // Format Date to string
    updatedAt: format(item.updatedAt, "MMMM do, yyyy"), // Format Date to string
    storeId: item.storeId, // Convert bigint to number
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LearningTypeClient data={formattedLearningTypes} />
      </div>
    </div>
  );
};
export default LearningTypesPage;