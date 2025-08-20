"use client";

import { useState, useEffect } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { QuestionClientPage } from "@/components/admin-dashboard/QuestionClientPage";
import { Skeleton } from "@/components/ui/skeleton";
import { Question } from "../../../../shared/prisma";

interface QuestionStatsData {
  totalQuestions: number;
  activeQuestions: number;
  categories: number;
}

const QuestionsManagementPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<QuestionStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch("http://localhost:8080/admin/questions", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch questions.");
      }

      const { questions, stats } = await response.json();
      setQuestions(questions);
      setStats(stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchQuestions();
  }, []);

  return (
    <SidebarInset>
      <header className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Question Management</h1>
      </header>
      <main className="relative p-4 md:p-8 min-h-[calc(100vh-61px)]">
        {isLoading || !stats ? (
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
          <QuestionClientPage
            initialQuestions={questions}
            initialStats={stats}
            onDataChange={fetchQuestions}
          />
        )}
      </main>
    </SidebarInset>
  );
};

export default QuestionsManagementPage;
