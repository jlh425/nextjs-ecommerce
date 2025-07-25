"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { tool } from "@prisma/client"
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
  description: z.string().min(4).max(9).regex(/^#/, {
    message: 'String must be a valid hex code'
  }),
});

type ToolFormValues = z.infer<typeof formSchema>

interface ToolFormProps {
  initialData: tool | null;
};
export const ToolForm: React.FC<ToolFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit tool' : 'Create tool';
  const description = initialData ? 'Edit a tool.' : 'Add a new tool';
  const toastMessage = initialData ? 'Tool updated.' : 'Tool created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: ''
    }
  });

    const onSubmit = async (data: ToolFormValues) => {
        try {
        setLoading(true);
        if (initialData) {
            await axios.patch(`/api/${params.storeId}/tool/${params.toolId}`, data);
        } else {
            await axios.post(`/api/${params.storeId}/tool`, data);
        }
        router.refresh();
        router.push(`/${params.storeId}/tool`);
        toast.success(toastMessage);
        } catch (error) {
        toast.error('Something went wrong.');
        } finally {
        setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/tool/${params.toolId}`);
            router.refresh();
            router.push(`/${params.storeId}/tool`);
            toast.success('Tool deleted.');
        } catch (error) {
            toast.error('Make sure you removed all categories using this tool first.');
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
                    <div className="md:grid md:grid-cols-3 md:gap-8">
                        
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tool Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Tool name" {...field} />
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
                                <FormLabel>Tool Description</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Tool Description" {...field} />
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
};