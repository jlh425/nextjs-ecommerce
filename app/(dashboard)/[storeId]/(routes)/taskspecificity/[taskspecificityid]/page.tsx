import prismadb from "@/lib/prismadb";
import { TaskSpecificityForm } from "./components/taskspecificity-form";

const TaskSpecificityPage = async ({
  params
}: {
    params: { taskspecificityid: number }
    }) => {
    const taskSpecificity = await prismadb.taskSpecificity.findUnique({
        where: {
        id: params.taskspecificityid
        }
    });
    
    return ( 
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <TaskSpecificityForm initialData={taskSpecificity} />
        </div>
        </div>
    );
    }
    
export default TaskSpecificityPage;