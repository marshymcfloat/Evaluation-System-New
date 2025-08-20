"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import { Plus } from "lucide-react";

// Import your custom components
import SubjectStats from "./SubjectStats";
import SubjectTable from "./SubjectTable";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Import your shared Prisma types
import { Subject as PrismaSubject } from "../../../shared/prisma"; // Adjust path if needed

// Zod schema for form validation
const subjectFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  subjectCode: z
    .string()
    .min(3, { message: "Code must be at least 3 characters." }),
  iconName: z.string().optional(),
});

// TypeScript types
type SubjectFormValues = z.infer<typeof subjectFormSchema>;
type SubjectWithCounts = PrismaSubject & {
  _count: { students: number; instructors: number };
};
interface Stats {
  totalSubjects: number;
  subjectsWithoutInstructors: number;
  mostEnrolledSubject: { name: string; studentCount: number } | null;
}

// Props for the component
interface SubjectClientPageProps {
  initialSubjects: SubjectWithCounts[];
  initialStats: Stats;
}

export function SubjectClientPage({
  initialSubjects,
  initialStats,
}: SubjectClientPageProps) {
  // State Management
  const [subjects, setSubjects] =
    useState<SubjectWithCounts[]>(initialSubjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectWithCounts | null>(null);

  // Form Initialization
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: { name: "", subjectCode: "", iconName: "" },
  });

  // Event Handlers
  const handleAddNew = () => {
    setSelectedSubject(null);
    form.reset({ name: "", subjectCode: "", iconName: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (subject: SubjectWithCounts) => {
    setSelectedSubject(subject);
    form.reset({
      name: subject.name,
      subjectCode: subject.subjectCode,
      iconName: subject.iconName || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (subject: SubjectWithCounts) => {
    setSelectedSubject(subject);
    setIsDeleteDialogOpen(true);
  };

  // API Communication: Create/Update
  const onSubmit = async (values: SubjectFormValues) => {
    const isEditing = !!selectedSubject;
    const url = isEditing
      ? `http://localhost:8080/admin/subjects/${selectedSubject.id}`
      : // Make sure your relative URL is correct
        `http://localhost:8080/admin/subjects`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);

      toast.success(responseData.message);

      // --- SIMPLIFIED STATE UPDATE LOGIC ---
      // This works because the backend now returns the full object with `_count`.
      if (isEditing) {
        // Replace the old object with the complete new one from the API.
        setSubjects(
          subjects.map((s) =>
            s.id === responseData.subject.id ? responseData.subject : s
          )
        );
      } else {
        // Add the complete new object from the API to the list.
        setSubjects(
          [...subjects, responseData.subject].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // API Communication: Delete
  const confirmDelete = async () => {
    if (!selectedSubject) return;
    try {
      const response = await fetch(
        `http://localhost:8080/admin/subjects/${selectedSubject.id}`,
        { method: "DELETE" }
      );
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);

      toast.success(responseData.message);
      setSubjects(subjects.filter((s) => s.id !== selectedSubject.id));
      setIsDeleteDialogOpen(false);
      setSelectedSubject(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      <SubjectStats {...initialStats} />

      <SubjectTable
        subjects={subjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="fixed bottom-8 right-8">
        <Button
          onClick={handleAddNew}
          size="lg"
          className="rounded-full h-14 w-14 p-0 shadow-lg"
        >
          <span className="sr-only">Add Subject</span>
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSubject ? "Edit Subject" : "Add New Subject"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Subject Name</FormLabel>{" "}
                    <FormControl>
                      <Input placeholder="e.g., Advanced Calculus" {...field} />
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Subject Code</FormLabel>{" "}
                    <FormControl>
                      <Input placeholder="e.g., MATH-301" {...field} />
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>
                      Icon Name{" "}
                      <span className="text-muted-foreground">(Optional)</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        placeholder="e.g., Calculator"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subject "{selectedSubject?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
