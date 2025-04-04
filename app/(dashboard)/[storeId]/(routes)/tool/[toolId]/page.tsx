import prismadb from "@/lib/prismadb";

import { ToolForm } from "./components/tool-form";

const ToolPage = async ({
  params
}: {
  params: { toolId: number }
}) => {
  const tool = await prismadb.tool.findUnique({
    where: {
      id: params.toolId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ToolForm initialData={tool} />
      </div>
    </div>
  );
}
export default ToolPage;