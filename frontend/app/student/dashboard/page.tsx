import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentDashboardClient } from "@/components/student-dashboard/StudentDashboardClient";
import { cookies } from "next/headers";

export interface SubjectForEvaluation {
  subject: {
    id: string;
    name: string;
    subjectCode: string;
  };
  instructor: {
    id: string;
    name: string;
  };
  hasEvaluated: boolean;
}

async function getSubjectsForEvaluation(): Promise<SubjectForEvaluation[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("No auth token found in cookies.");
    return [];
  }

  try {
    const response = await fetch(
      "http://localhost:8080/student/subjects-for-evaluation",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch subjects. Status: ${response.status}`);
      throw new Error("Failed to fetch subjects");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

const StudentDashboardPage = async () => {
  const subjects = await getSubjectsForEvaluation();

  console.log(subjects);
  return (
    <SidebarInset>
      <header className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Student Dashboard</h1>
      </header>

      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Your Subjects</h2>
          <p className="text-muted-foreground">
            Select a subject and instructor to begin your evaluation.
          </p>
        </div>
        <p></p>
        <StudentDashboardClient subjects={subjects} />
      </div>
    </SidebarInset>
  );
};

export default StudentDashboardPage;
