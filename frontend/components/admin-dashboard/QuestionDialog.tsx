"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Question } from "../../../shared/prisma";
import { toast } from "sonner"; // It's good practice to use toast for errors too

const questionFormSchema = z.object({
  questionText: z
    .string()
    .min(10, { message: "Question must be at least 10 characters." }),
  category: z.string().min(3, { message: "Category is required." }),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveSuccess: () => void;
  initialData: Question | null;
}

export const QuestionDialog = ({
  isOpen,
  onOpenChange,
  onSaveSuccess,
  initialData,
}: QuestionDialogProps) => {
  const isEditMode = Boolean(initialData);
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: { questionText: "", category: "" },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      form.reset({
        questionText: initialData.questionText,
        category: initialData.category,
      });
    } else {
      form.reset({ questionText: "", category: "" });
    }
  }, [initialData, form, isEditMode]);

  const onSubmit = async (values: QuestionFormValues) => {
    const url = isEditMode
      ? `http://localhost:8080/admin/questions/${initialData?.id}`
      : "http://localhost:8080/admin/questions";
    const method = isEditMode ? "PUT" : "POST";

    const payload = {
      ...values, // This has questionText and category from the form
      isActive: isEditMode ? initialData?.isActive : true,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send the complete payload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }
      onSaveSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message); // Show a toast on failure
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Question" : "Add New Question"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of this question."
              : "Create a new question for evaluations."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'The instructor communicates course material clearly.'"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 'Communication', 'Course Structure'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Question"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
