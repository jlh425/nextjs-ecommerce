import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { TaskSpecificityColumn } from "./components/columns";
import { TaskSpecificityClient } from "./components/client";

const TaskSpecificityPage = async ({
  params
}: {
  params: { storeId: number }
}) => {
  const taskSpecificities = await prismadb.taskSpecificity.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedTaskSpecificities: TaskSpecificityColumn[] = taskSpecificities.map((item) => ({
    id: Number(item.id),
    type: item.type,
    description: item.description || '',
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <TaskSpecificityClient data={formattedTaskSpecificities} />
        </div>
        </div>
    );
}
export default TaskSpecificityPage;