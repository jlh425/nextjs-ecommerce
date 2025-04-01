"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { AIModel, Color } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
  type: z.string().min(2),
  description: z.string().min(2),
});

type taskSpecificityFormValues = z.infer<typeof formSchema>
interface taskSpecificityFormProps {
    initialData: any | null;
    };

export const TaskSpecificityForm: React.FC<taskSpecificityFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit task specificity' : 'Create task specificity';
  const description = initialData ? 'Edit a task specificity.' : 'Add a new task specificity';
  const toastMessage = initialData ? 'task specificity updated.' : 'task specificity created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<taskSpecificityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || "",
      description: initialData?.description || "", // Convert null to an empty string
    },
  });
    const onSubmit = async (data: taskSpecificityFormValues) => {
        try {
        setLoading(true);
        if (initialData) {
            await axios.patch(`/api/${params.storeId}/taskSpecificity/${params.taskSpecificityId}`, data);
        } else {
            await axios.post(`/api/${params.storeId}/taskSpecificity`, data);
        }
    
        router.refresh();
        router.push(`/${params.storeId}/taskSpecificity`);
        toast.success(toastMessage);
        } catch (error) {
        toast.error("Something went wrong.");
        } finally {
        setLoading(false);
        }
    };
const onDelete = async () => {
        try {
        setLoading(true);
        await axios.delete(`/api/${params.storeId}/taskSpecificity/${params.taskSpecificityId}`);
        router.refresh();
        router.push(`/${params.storeId}/taskSpecificity`);
        toast.success("task specificity deleted.");
        } catch (error) {
        toast.error("Make sure you removed all categories first.");
        } finally {
        setLoading(false);
        setOpen(false);
        }
    }
return (
    <>
        <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        />
        
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>  
                                    <FormLabel> Task Type </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Task Type" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        
                                    
    </>
)
}
