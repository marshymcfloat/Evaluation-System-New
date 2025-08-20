"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ClipboardList, Tags } from "lucide-react";

interface QuestionStatsProps {
  totalQuestions: number;
  activeQuestions: number;
  categories: number;
}

const QuestionStats = ({
  totalQuestions,
  activeQuestions,
  categories,
}: QuestionStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuestions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Questions
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeQuestions}</div>
          <p className="text-xs text-muted-foreground">
            out of {totalQuestions} total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Unique Categories
          </CardTitle>
          <Tags className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionStats;
