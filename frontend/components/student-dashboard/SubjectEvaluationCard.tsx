"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { SubjectForEvaluation } from "@/app/student/dashboard/page";

type SubjectEvaluationCardProps = SubjectForEvaluation;

export const SubjectEvaluationCard = ({
  subject,
  instructor,
  hasEvaluated,
}: SubjectEvaluationCardProps) => {
  const router = useRouter();

  const handleEvaluate = () => {
    // Navigate to the evaluation page with the necessary IDs in the query params
    router.push(
      `/student/evaluate?subjectId=${subject.id}&instructorId=${instructor.id}`
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{subject.name}</CardTitle>
        <CardDescription>{subject.subjectCode}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm">
          <p className="text-muted-foreground">Instructor</p>
          <p className="font-semibold">{instructor.name}</p>
        </div>
      </CardContent>
      <CardFooter>
        {hasEvaluated ? (
          <Button disabled className="w-full">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Already Evaluated
          </Button>
        ) : (
          <Button className="w-full" onClick={handleEvaluate}>
            Evaluate Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
