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
import {
  CheckCircle2,
  BookOpen,
  Calculator,
  Code,
  Dna,
  Landmark,
  Palette,
  Shield,
  Network,
  Database,
  Share2,
  Component,
  AppWindow,
  Library,
} from "lucide-react";
import { SubjectForEvaluation } from "../../../shared/types";

const iconMap: { [key: string]: React.ElementType } = {
  Calculator,
  Code,
  BookOpen,
  Dna,
  Palette,
  Landmark,
  Shield,
  Network,
  Database,
  Share2,
  Component,
  AppWindow,
  default: Library, // Fallback icon
};

export const SubjectEvaluationCard = ({
  subject,
  instructor,
  hasEvaluated,
}: SubjectForEvaluation) => {
  const router = useRouter();

  const handleEvaluate = () => {
    router.push(
      `/student/evaluate?subjectId=${subject.id}&instructorId=${instructor.id}`
    );
  };

  const IconComponent =
    (subject.iconName && iconMap[subject.iconName]) || iconMap.default;

  return (
    <Card className="flex flex-col transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{subject.name}</CardTitle>
            <CardDescription className="pt-1">
              {subject.subjectCode}
            </CardDescription>
          </div>
          <IconComponent className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm">
          <p className="text-muted-foreground">Instructor</p>
          <p className="font-semibold text-base">{instructor.name}</p>
        </div>
      </CardContent>
      <CardFooter>
        {hasEvaluated ? (
          <Button
            disabled
            className="w-full bg-green-600 hover:bg-green-600 cursor-not-allowed"
          >
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
