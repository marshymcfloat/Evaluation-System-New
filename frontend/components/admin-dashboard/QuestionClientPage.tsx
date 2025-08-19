"use client";

import React, { useState } from "react";
import { Question } from "../../../shared/prisma";
import { QuestionTable } from "./QuestionTable";
import { QuestionDialog } from "./AddQuestion";
import { Button } from "@/components/ui/button";

interface QuestionClientPageProps {
  initialQuestions: Question[];
}

export const QuestionClientPage = ({
  initialQuestions,
}: QuestionClientPageProps) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

  const categories = [...new Set(questions.map((q) => q.category))];

  const refreshQuestions = async () => {
    try {
      const response = await fetch("http://localhost:8080/admin/questions");
      if (!response.ok) throw new Error("Failed to re-fetch questions");
      const data: Question[] = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenAddDialog = () => {
    setQuestionToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (question: Question) => {
    setQuestionToEdit(question);
    setIsDialogOpen(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }
    try {
      await fetch(`http://localhost:8080/admin/questions/${questionId}`, {
        method: "DELETE",
      });
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== questionId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex-grow">
        <QuestionTable
          questions={questions}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteQuestion}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleOpenAddDialog}>Add New Question</Button>
      </div>

      <QuestionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSaveSuccess={refreshQuestions}
        initialData={questionToEdit}
        categories={categories}
      />
    </>
  );
};
