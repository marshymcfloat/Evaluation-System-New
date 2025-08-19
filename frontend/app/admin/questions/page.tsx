import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { QuestionClientPage } from "@/components/admin-dashboard/QuestionClientPage";
import { Question } from "../../../../shared/prisma";

async function getQuestions(): Promise<Question[]> {
  try {
    const response = await fetch("http://localhost:8080/admin/questions", {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

const QuestionPage = async () => {
  const initialQuestions = await getQuestions();

  return (
    <SidebarInset>
      <header className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Question Management</h1>
      </header>

      <div className="p-8 flex gap-4 flex-col h-full">
        {}
        <div>
          <Card className="max-w-[200px]">
            <CardHeader>
              <CardTitle>Total Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl">{initialQuestions.length}</p>
            </CardContent>
          </Card>
        </div>

        <QuestionClientPage initialQuestions={initialQuestions} />
      </div>
    </SidebarInset>
  );
};

export default QuestionPage;
