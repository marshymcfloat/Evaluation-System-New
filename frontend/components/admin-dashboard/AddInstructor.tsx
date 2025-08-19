"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Providers/ReduxProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Subject } from "../../../shared/prisma";
import SubjectBadge from "../SubjectBadge";
import { adminSliceAction } from "@/lib/slice";
import Spinner from "../ui/Spinner";
import { InstructorWithSubjects } from "@/app/admin/dashboard/page";

const departments = [
  { code: "CET", name: "college of engineering & technology" },
  { code: "CNHS", name: "college of Nursing & Health Science" },
  { code: "CBA", name: "college of backing & accountancy" },
  { code: "CCJE", name: "college of criminology justice education" },
  { code: "CHM", name: "college of Hospitality management" },
];

interface InstructorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveSuccess: () => void;
  initialData: InstructorWithSubjects | null;
}

const InstructorDialog = ({
  isOpen,
  onOpenChange,
  onSaveSuccess,
  initialData,
}: InstructorDialogProps) => {
  const dispatch = useDispatch();
  const { subjects } = useSelector((state: RootState) => state.admin);

  const [name, setName] = useState("");
  const [instructorID, setInstructorID] = useState("");
  const [department, setDepartment] = useState("");
  const [addedSubjects, setAddedSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setInstructorID(initialData.instructorID);
      setAddedSubjects(initialData.subjects || []);
    } else {
      setName("");
      setInstructorID("");
      setDepartment("");
      setAddedSubjects([]);
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingSubjects(true);
      try {
        const response = await fetch("http://localhost:8080/admin/getSubjects");
        if (!response.ok) return;
        const data = await response.json();
        dispatch(adminSliceAction.addSubjects(data));
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    if (subjects.length === 0 && !isLoadingSubjects) {
      fetchData();
    }
  }, [dispatch, subjects.length, isLoadingSubjects]);

  const handleAddSubject = (subjectToAdd: Subject) => {
    if (!addedSubjects.some((s) => s.id === subjectToAdd.id)) {
      setAddedSubjects([...addedSubjects, subjectToAdd]);
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    setAddedSubjects(addedSubjects.filter((s) => s.id !== subjectId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = isEditMode
      ? `http://localhost:8080/admin/instructors/${initialData?.id}`
      : "http://localhost:8080/admin/createInstructor";

    const method = isEditMode ? "PUT" : "POST";

    const payload = {
      name,
      instructorID,
      subjectIds: addedSubjects.map((s) => s.id),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Operation failed");
      }
      onSaveSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSubjects = subjects.filter(
    (sub) => !addedSubjects.some((addedSub) => addedSub.id === sub.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Instructor" : "Add New Instructor"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details for this instructor."
                : "Fill in the details for the new instructor."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructorID" className="text-right">
                Instructor ID
              </Label>
              <Input
                id="instructorID"
                value={instructorID}
                onChange={(e) => setInstructorID(e.target.value)}
                placeholder="e.g., jdoe123"
                className="col-span-3"
                required
                disabled={isEditMode}
              />
            </div>
            {}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dep) => (
                    <SelectItem
                      key={dep.code}
                      value={dep.code}
                      className="capitalize"
                    >
                      {dep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Selected Subjects</Label>
              <div className="border p-3 min-h-[80px] rounded-md flex flex-wrap gap-2">
                {addedSubjects.map((sub) => (
                  <SubjectBadge
                    key={sub.id}
                    subject={sub.subjectCode}
                    onClick={() => handleRemoveSubject(sub.id)}
                    isRemovable
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Available Subjects</Label>
              <div className="border p-3 rounded-md flex flex-wrap gap-2">
                {isLoadingSubjects ? (
                  <Spinner />
                ) : (
                  availableSubjects.map((sub) => (
                    <SubjectBadge
                      key={sub.id}
                      subject={sub.subjectCode}
                      onClick={() => handleAddSubject(sub)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {isEditMode ? "Save Changes" : "Add Instructor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorDialog;
