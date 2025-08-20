"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserX, Users } from "lucide-react";

interface InstructorStatsProps {
  totalInstructors: number;
  instructorsWithoutSubjects: number;
  instructorWithMostStudents: { name: string; studentCount: number } | null;
}

const InstructorStats = ({
  totalInstructors,
  instructorsWithoutSubjects,
  instructorWithMostStudents,
}: InstructorStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Instructors
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInstructors}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Instructors without Subjects
          </CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{instructorsWithoutSubjects}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top Instructor (by Students)
          </CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {instructorWithMostStudents ? (
            <>
              <div className="text-2xl font-bold">
                {instructorWithMostStudents.name}
              </div>
              <p className="text-xs text-muted-foreground">
                teaching {instructorWithMostStudents.studentCount} students
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

export default InstructorStats;
