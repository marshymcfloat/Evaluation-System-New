"use client";

import { useState, useEffect } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { InstructorClientPage } from "@/components/admin-dashboard/InstructorClientPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Instructor, Subject } from "../../../../shared/prisma";

export type InstructorWithDetails = Instructor & {
  subjects: Subject[];
  studentCount: number;
};

const InstructorsManagementPage = () => {
  const [instructors, setInstructors] = useState<InstructorWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch("http://localhost:8080/admin/instructors", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch instructors.");
      }

      const data: InstructorWithDetails[] = await response.json();
      setInstructors(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchInstructors();
  }, []);

  const totalInstructors = instructors.length;
  const instructorsWithoutSubjects = instructors.filter(
    (inst) => inst.subjects.length === 0
  ).length;

  const instructorWithMostStudents = instructors.reduce(
    (max, inst) => (inst.studentCount > (max?.studentCount ?? -1) ? inst : max),
    null as InstructorWithDetails | null
  );

  const stats = {
    totalInstructors,
    instructorsWithoutSubjects,
    instructorWithMostStudents: instructorWithMostStudents
      ? {
          name: instructorWithMostStudents.name,
          studentCount: instructorWithMostStudents.studentCount,
        }
      : null,
  };

  return (
    <SidebarInset>
      <header className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Instructor Management</h1>
      </header>
      <main className="relative p-4 md:p-8 min-h-[calc(100vh-61px)]">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="text-red-600 bg-red-100 p-4 rounded-md">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        ) : (
          <InstructorClientPage
            initialInstructors={instructors}
            initialStats={stats}
            onDataChange={fetchInstructors}
          />
        )}
      </main>
    </SidebarInset>
  );
};

export default InstructorsManagementPage;
