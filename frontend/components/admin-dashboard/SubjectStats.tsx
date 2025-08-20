"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, UserX, Users } from "lucide-react";

interface SubjectStatsProps {
  totalSubjects: number;
  subjectsWithoutInstructors: number;
  mostEnrolledSubject: { name: string; studentCount: number } | null;
}

const SubjectStats = ({
  totalSubjects,
  subjectsWithoutInstructors,
  mostEnrolledSubject,
}: SubjectStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
          <BookCopy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubjects}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Subjects without Instructor
          </CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subjectsWithoutInstructors}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Most Enrolled Subject
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {mostEnrolledSubject ? (
            <>
              <div className="text-2xl font-bold">
                {mostEnrolledSubject.name}
              </div>
              <p className="text-xs text-muted-foreground">
                with {mostEnrolledSubject.studentCount} students
              </p>
            </>
          ) : (
            <div className="text-lg font-medium text-muted-foreground">N/A</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectStats;
