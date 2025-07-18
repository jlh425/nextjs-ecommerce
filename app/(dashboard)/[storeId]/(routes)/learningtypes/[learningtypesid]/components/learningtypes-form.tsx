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
  name: z.string().min(2),
  description: z.string().min(2),
});
type LearningTypesFormValues = z.infer<typeof formSchema>
interface LearningTypesFormProps {
  initialData: any;
};

export const LearningTypesForm: React.FC<LearningTypesFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Learning Types' : 'Create Learning Types';
  const description = initialData ? 'Edit a Learning Types.' : 'Add a new Learning Types';
  const toastMessage = initialData ? 'Learning Types updated.' : 'Learning Types created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<LearningTypesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "", // Convert null to an empty string
    },
  });
    const onSubmit = async (data: LearningTypesFormValues) => {
        try {
        setLoading(true);
        if (initialData) {
            await axios.patch(`/api/${params.storeId}/learningtypes/${params.learningtypesid}`, data);
        } else {
            await axios.post(`/api/${params.storeId}/learningtypes`, data);
        }
        router.refresh();
        router.push(`/${params.storeId}/(routes)/learningtypes`);
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
        await axios.delete(`/api/${params.storeId}/learningtypes/${params.learningtypesid}`);
        router.refresh();
        router.push(`/${params.storeId}/(routes)/learningtypes`);
        toast.success("Learning Types deleted.");
        } catch (error) {
        toast.error("Make sure you removed all categories using this Learning Types first.");
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" disabled={loading} {...field} />
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
                                    <Input placeholder="Description" disabled={loading} {...field} />
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