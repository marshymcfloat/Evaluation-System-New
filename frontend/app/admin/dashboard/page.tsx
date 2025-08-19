"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import InstructorTable from "@/components/admin-dashboard/InstructorTable";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import InstructorDialog from "@/components/admin-dashboard/AddInstructor";
import { Instructor, Subject } from "../../../../shared/prisma";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";

export type InstructorWithSubjects = Instructor & {
  subjects: Subject[];
  studentCount?: number;
};

const AdminDashboardPage = () => {
  const [instructors, setInstructors] = useState<InstructorWithSubjects[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for Add/Edit Dialog
  const [isInstructorDialogOpen, setIsInstructorDialogOpen] = useState(false);
  const [instructorToEdit, setInstructorToEdit] =
    useState<InstructorWithSubjects | null>(null);

  // State for Delete Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] =
    useState<InstructorWithSubjects | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInstructors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:8080/admin/getInstructors"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch instructors");
      }
      const data: InstructorWithSubjects[] = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // --- Handlers for Add/Edit ---
  const handleOpenAddDialog = () => {
    setInstructorToEdit(null); // Clear any previous edit data
    setIsInstructorDialogOpen(true);
  };

  const handleOpenEditDialog = (instructor: InstructorWithSubjects) => {
    setInstructorToEdit(instructor);
    setIsInstructorDialogOpen(true);
  };

  // --- Handlers for Delete ---
  const handleOpenDeleteDialog = (instructor: InstructorWithSubjects) => {
    setInstructorToDelete(instructor);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/admin/instructors/${instructorToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete instructor");

      // Refresh list and close dialog on success
      fetchInstructors();
      setIsDeleteDialogOpen(false);
      setInstructorToDelete(null);
    } catch (error) {
      console.error(error);
      // TODO: Show an error toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SidebarInset>
      <header className="flex items-center gap-2 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </header>

      <div className="p-8 flex gap-4 flex-col h-full">
        <div>
          <Card className="max-w-[200px]">
            <CardHeader>
              <CardTitle>Instructor Count</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl">
                {isLoading ? "..." : instructors.length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <InstructorTable
              instructors={instructors}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
            />
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleOpenAddDialog}>Add Instructor</Button>
        </div>
      </div>

      {/* Edit/Add Dialog */}
      <InstructorDialog
        isOpen={isInstructorDialogOpen}
        onOpenChange={setIsInstructorDialogOpen}
        onSaveSuccess={fetchInstructors}
        initialData={instructorToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Are you absolutely sure?"
        description={
          <>
            This action cannot be undone. This will permanently delete the
            instructor{" "}
            <strong className="text-foreground">
              {instructorToDelete?.name}
            </strong>{" "}
            and all associated data.
          </>
        }
      />
    </SidebarInset>
  );
};

export default AdminDashboardPage;
