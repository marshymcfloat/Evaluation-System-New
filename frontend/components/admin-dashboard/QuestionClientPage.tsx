"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Plus } from "lucide-react";

import { Question } from "../../../shared/prisma";
import QuestionStats from "./QuestionStats";
import { QuestionTable } from "./QuestionTable";
import { QuestionDialog } from "./QuestionDialog";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";

interface QuestionStatsData {
  totalQuestions: number;
  activeQuestions: number;
  categories: number;
}

interface QuestionClientPageProps {
  initialQuestions: Question[];
  initialStats: QuestionStatsData;
  onDataChange: () => void;
}

export const QuestionClientPage = ({
  initialQuestions,
  initialStats,
  onDataChange,
}: QuestionClientPageProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAddDialog = () => {
    setQuestionToEdit(null);
    setIsDialogOpen(true);
  };
  const handleOpenEditDialog = (question: Question) => {
    setQuestionToEdit(question);
    setIsDialogOpen(true);
  };
  const handleOpenDeleteDialog = (question: Question) => {
    setQuestionToDelete(question);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/questions/${questionToDelete.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete question");
      }
      toast.success("Question deleted successfully.");
      onDataChange();
      setIsDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <QuestionStats {...initialStats} />
      <QuestionTable
        questions={initialQuestions}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <div className="fixed bottom-8 right-8">
        <Button
          onClick={handleOpenAddDialog}
          size="lg"
          className="rounded-full h-14 w-14 p-0 shadow-lg"
        >
          <span className="sr-only">Add Question</span>
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <QuestionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSaveSuccess={() => {
          toast.success(
            `Question successfully ${questionToEdit ? "updated" : "added"}.`
          );
          onDataChange();
        }}
        initialData={questionToEdit}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Are you absolutely sure?"
        description={
          <>
            This action cannot be undone. This will permanently delete this
            question.
          </>
        }
      />
    </>
  );
};
