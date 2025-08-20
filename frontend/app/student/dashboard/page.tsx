"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentDashboardClient } from "@/components/student-dashboard/StudentDashboardClient";
import { SubjectForEvaluation } from "../../../../shared/types"; // Import from your new types file

type StudentUser = { name: string };

const StudentDashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<StudentUser | null>(null);
  const [subjects, setSubjects] = useState<SubjectForEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const storedUser = localStorage.getItem("user");

    if (role && role !== "student") {
      router.push("/auth");
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/auth");
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchSubjectsForEvaluation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await fetch(
          "http://localhost:8080/students/subjects-for-evaluation",
          {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch subjects.");
        }

        const data: SubjectForEvaluation[] = await response.json();
        setSubjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectsForEvaluation();
  }, [user]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[240px] rounded-xl" />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-red-600 bg-red-100 p-4 rounded-md border border-red-200">
          <h3 className="font-bold">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      );
    }
    return <StudentDashboardClient subjects={subjects} />;
  };

  if (!user) {
    // This shows a brief loading state while localStorage is checked.
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Welcome, {user.name}!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Please complete your evaluations for the following subjects.
          </p>
        </header>

        <section>{renderContent()}</section>
      </div>
    </main>
  );
};

export default StudentDashboardPage;
