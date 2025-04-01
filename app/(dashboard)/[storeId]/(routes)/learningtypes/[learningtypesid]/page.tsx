import prismadb from "@/lib/prismadb";
import { LearningTypesForm } from "./components/learningtypes-form";

const LearningTypesPage = async ({
  params
}: {
    params: { learningtypesid: number }
    }) => {
    const learningtypes = await prismadb.learningType.findUnique({
        where: {
        id: params.learningtypesid
        }
    });
    
    return ( 
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <LearningTypesForm initialData={learningtypes} />
        </div>
        </div>
    );
    }
export default LearningTypesPage;