import prismadb from "@/lib/prismadb";
import { AIModelForm } from "./components/aimodel-form";

const AiModelPage = async ({
  params
}: {
    params: { aimodelid: number }
    }) => {
    const aimodel = await prismadb.aIModel.findUnique({
        where: {
        id: params.aimodelid
        }
    });
    
    return ( 
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <AIModelForm initialData={aimodel} />
        </div>
        </div>
    );
    }

export default AiModelPage;