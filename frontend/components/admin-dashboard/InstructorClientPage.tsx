"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Plus } from "lucide-react";

import InstructorStats from "./InstructorStats";
import InstructorTable from "./InstructorTable";
import InstructorDialog from "./InstructorDialog";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { InstructorWithDetails } from "@/app/admin/dashboard/page";

interface Stats {
  totalInstructors: number;
  instructorsWithoutSubjects: number;
  instructorWithMostStudents: { name: string; studentCount: number } | null;
}

interface InstructorClientPageProps {
  initialInstructors: InstructorWithDetails[];
  initialStats: Stats;
  onDataChange: () => void;
}

export function InstructorClientPage({
  initialInstructors,
  initialStats,
  onDataChange,
}: InstructorClientPageProps) {
  const [isInstructorDialogOpen, setIsInstructorDialogOpen] = useState(false);
  const [instructorToEdit, setInstructorToEdit] =
    useState<InstructorWithDetails | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] =
    useState<InstructorWithDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAddDialog = () => {
    setInstructorToEdit(null);
    setIsInstructorDialogOpen(true);
  };

  const handleOpenEditDialog = (instructor: InstructorWithDetails) => {
    setInstructorToEdit(instructor);
    setIsInstructorDialogOpen(true);
  };

  const handleOpenDeleteDialog = (instructor: InstructorWithDetails) => {
    setInstructorToDelete(instructor);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/instructors/${instructorToDelete.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete instructor");
      }
      toast.success("Instructor deleted successfully.");
      onDataChange();
      setIsDeleteDialogOpen(false);
      setInstructorToDelete(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <InstructorStats {...initialStats} />
      <InstructorTable
        instructors={initialInstructors}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <div className="fixed bottom-8 right-8">
        <Button
          onClick={handleOpenAddDialog}
          size="lg"
          className="rounded-full h-14 w-14 p-0 shadow-lg"
        >
          <span className="sr-only">Add Instructor</span>
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <InstructorDialog
        isOpen={isInstructorDialogOpen}
        onOpenChange={setIsInstructorDialogOpen}
        onSaveSuccess={() => {
          toast.success(
            `Instructor successfully ${instructorToEdit ? "updated" : "added"}.`
          );
          onDataChange();
        }}
        initialData={instructorToEdit}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Are you absolutely sure?"
        description={
          <>
            This action cannot be undone. This will permanently delete the
            instructor{" "}
            <strong className="text-foreground">
              {instructorToDelete?.name}
            </strong>
            .
          </>
        }
      />
    </>
  );
}
