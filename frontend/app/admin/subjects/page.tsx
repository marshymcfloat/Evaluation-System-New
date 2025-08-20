"use client";

import { useState, useEffect } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SubjectClientPage } from "@/components/admin-dashboard/SubjectClientPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Subject as PrismaSubject } from "../../../../shared/prisma";

type SubjectWithCounts = PrismaSubject & {
  _count: {
    students: number;
    instructors: number;
  };
};

const SubjectsManagementPage = () => {
  const [subjects, setSubjects] = useState<SubjectWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch("http://localhost:8080/admin/subjects", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch subjects.");
        }

        const data: SubjectWithCounts[] = await response.json();
        setSubjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const totalSubjects = subjects.length;
  const subjectsWithoutInstructors = subjects.filter(
    (s) => s._count.instructors === 0
  ).length;

  const mostEnrolledSubject = subjects.reduce(
    (max, subject) =>
      subject._count.students > (max?._count.students ?? -1) ? subject : max,
    null as SubjectWithCounts | null
  );

  const stats = {
    totalSubjects,
    subjectsWithoutInstructors,
    mostEnrolledSubject: mostEnrolledSubject
      ? {
          name: mostEnrolledSubject.name,
          studentCount: mostEnrolledSubject._count.students,
        }
      : null,
  };

  return (
    <SidebarInset>
      <header className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Subject Management</h1>
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
          <SubjectClientPage initialSubjects={subjects} initialStats={stats} />
        )}
      </main>
    </SidebarInset>
  );
};

export default SubjectsManagementPage;
