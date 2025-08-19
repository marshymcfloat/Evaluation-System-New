"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import SubjectBadge from "../SubjectBadge";
import { InstructorWithSubjects } from "@/app/admin/dashboard/page";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface InstructorTableProps {
  instructors: InstructorWithSubjects[];
  onEdit: (instructor: InstructorWithSubjects) => void;
  onDelete: (instructor: InstructorWithSubjects) => void;
}

const InstructorTable = ({
  instructors,
  onEdit,
  onDelete,
}: InstructorTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructors</CardTitle>
        <CardDescription>
          A list of instructors for this semester.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead className="w-[100px]">Students</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.length > 0 ? (
              instructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">
                    {instructor.name}
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2 max-w-lg">
                    {instructor.subjects.map((sub) => (
                      <SubjectBadge key={sub.id} subject={sub.subjectCode} />
                    ))}
                  </TableCell>
                  <TableCell>{instructor.studentCount || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(instructor)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => onDelete(instructor)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No instructors found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InstructorTable;
