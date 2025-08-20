"use client";

import React from "react";
import { SubjectForEvaluation } from "../../../shared/types";

import { SubjectEvaluationCard } from "./SubjectEvaluationCard";

interface StudentDashboardClientProps {
  subjects: SubjectForEvaluation[];
}

export const StudentDashboardClient = ({
  subjects,
}: StudentDashboardClientProps) => {
  if (subjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg bg-background">
        <p className="text-muted-foreground">
          You have no subjects to evaluate at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map(({ subject, instructor, hasEvaluated }) => (
        <SubjectEvaluationCard
          key={`${subject.id}-${instructor.id}`}
          subject={subject}
          instructor={instructor}
          hasEvaluated={hasEvaluated}
        />
      ))}
    </div>
  );
};
