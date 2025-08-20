import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";

export const getInstructors = async (req: Request, res: Response) => {
  try {
    const instructorsData = await prisma.instructor.findMany({
      include: {
        subjects: {
          select: {
            subjectId: true,
            subject: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const instructorsWithStudentCount = await Promise.all(
      instructorsData.map(async (instructor) => {
        const subjectIds = instructor.subjects.map(
          (instSub) => instSub.subjectId
        );

        let studentCount = 0;
        if (subjectIds.length > 0) {
          const distinctStudents = await prisma.studentSubject.groupBy({
            by: ["studentId"],
            where: {
              subjectId: {
                in: subjectIds,
              },
            },
          });
          studentCount = distinctStudents.length;
        }

        return {
          id: instructor.id,
          instructorID: instructor.instructorID,
          name: instructor.name,
          password: instructor.password,
          createdAt: instructor.createdAt,
          updatedAt: instructor.updatedAt,
          subjects: instructor.subjects.map((instSub) => instSub.subject),
          studentCount: studentCount,
        };
      })
    );

    return res.status(200).json(instructorsWithStudentCount);
  } catch (err) {
    console.error("Error fetching instructors:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createInstructor = async (req: Request, res: Response) => {
  const { name, instructorID, subjectIds } = req.body;

  if (!name || !instructorID || !subjectIds) {
    return res
      .status(400)
      .json({ message: "Name, instructorID, and subjectIds are required." });
  }

  if (!Array.isArray(subjectIds)) {
    return res.status(400).json({ message: "subjectIds must be an array." });
  }

  try {
    const newInstructor = await prisma.$transaction(async (tx) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(instructorID, salt);

      const instructor = await tx.instructor.create({
        data: {
          name,
          instructorID,
          password: hashedPassword,
        },
      });

      if (subjectIds.length > 0) {
        const instructorSubjectData = subjectIds.map((subjectId: string) => ({
          instructorId: instructor.id,
          subjectId: subjectId,
        }));

        await tx.instructorSubject.createMany({
          data: instructorSubjectData,
        });
      }

      return instructor;
    });

    const { password: _, ...instructorWithoutPassword } = newInstructor;

    return res.status(201).json({
      message: "Instructor created successfully.",
      instructor: instructorWithoutPassword,
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({
        message: `An instructor with ID '${instructorID}' already exists.`,
      });
    }

    if (err.code === "P2003") {
      return res
        .status(400)
        .json({ message: "One or more subject IDs are invalid." });
    }

    console.error("Error creating instructor:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, subjectIds } = req.body;

  if (!name || !subjectIds || !Array.isArray(subjectIds)) {
    return res
      .status(400)
      .json({ message: "Name and a subjectIds array are required." });
  }

  try {
    const updatedInstructor = await prisma.$transaction(async (tx) => {
      const instructor = await tx.instructor.update({
        where: { id },
        data: { name },
      });

      await tx.instructorSubject.deleteMany({
        where: { instructorId: id },
      });

      if (subjectIds.length > 0) {
        const instructorSubjectData = subjectIds.map((subjectId: string) => ({
          instructorId: id,
          subjectId: subjectId,
        }));
        await tx.instructorSubject.createMany({
          data: instructorSubjectData,
        });
      }

      return instructor;
    });

    return res.status(200).json({
      message: "Instructor updated successfully.",
      instructor: updatedInstructor,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: `Instructor with ID ${id} not found.` });
    }
    console.error("Error updating instructor:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.instructorSubject.deleteMany({
        where: { instructorId: id },
      });

      await tx.instructor.delete({
        where: { id },
      });
    });

    return res
      .status(200)
      .json({ message: "Instructor deleted successfully." });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: `Instructor with ID ${id} not found.` });
    }
    console.error("Error deleting instructor:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  const { questionText, category } = req.body;

  if (!questionText || !category) {
    return res
      .status(400)
      .json({ message: "questionText and category are required." });
  }

  try {
    const newQuestion = await prisma.question.create({
      data: {
        questionText,
        category,
        isActive: true,
      },
    });
    return res.status(201).json({
      message: "Question created successfully.",
      question: newQuestion,
    });
  } catch (err) {
    console.error("Error creating question:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: {
        category: "asc",
      },
    });

    const stats = {
      totalQuestions: questions.length,
      activeQuestions: questions.filter((q) => q.isActive).length,
      categories: new Set(questions.map((q) => q.category)).size,
    };

    return res.status(200).json({ questions, stats });
  } catch (err) {
    console.error("Error fetching questions:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { questionText, category, isActive } = req.body;

  if (!questionText || !category || typeof isActive !== "boolean") {
    return res.status(400).json({
      message: "questionText, category, and a boolean isActive are required.",
    });
  }

  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: id },
      data: {
        questionText,
        category,
        isActive,
      },
    });
    return res.status(200).json({
      message: "Question updated successfully.",
      question: updatedQuestion,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: `Question with ID ${id} not found.` });
    }
    console.error("Error updating question:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.question.delete({
      where: { id: id },
    });
    return res
      .status(200)
      .json({ message: `Question with ID ${id} deleted successfully.` });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: `Question with ID ${id} not found.` });
    }
    console.error("Error deleting question:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getSubjectWithCounts = (id: string) => {
  return prisma.subject.findUnique({
    where: { id },
    include: {
      _count: {
        select: { students: true, instructors: true },
      },
    },
  });
};

export const createSubject = async (req: Request, res: Response) => {
  const { subjectCode, name, iconName } = req.body;

  if (!subjectCode || !name) {
    return res
      .status(400)
      .json({ message: "Subject code and name are required." });
  }

  // Sanitize input: convert empty string for iconName to null for the database.
  const dataToCreate = {
    subjectCode,
    name,
    iconName: iconName === "" ? null : iconName,
  };

  try {
    const newSubject = await prisma.subject.create({
      data: dataToCreate,
    });

    // After creating, fetch the full object with counts to return to the client.
    const subjectWithCounts = await getSubjectWithCounts(newSubject.id);

    return res.status(201).json({
      message: "Subject created successfully.",
      subject: subjectWithCounts, // Return the full object with _count
    });
  } catch (err: any) {
    // Handle unique constraint violations (e.g., duplicate subject code or name).
    if (err.code === "P2002") {
      const target = err.meta?.target || "fields";
      return res.status(409).json({
        message: `A subject with this code or name already exists. Failed on: ${target}`,
      });
    }

    // Handle all other errors.
    console.error("Error creating subject:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },

      include: {
        _count: {
          select: {
            students: true,
            instructors: true,
          },
        },
      },
    });

    return res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subjectCode, name, iconName } = req.body;

  if (!subjectCode || !name) {
    return res
      .status(400)
      .json({ message: "Subject code and name are required." });
  }

  const dataToUpdate = {
    subjectCode,
    name,
    iconName: iconName === "" ? null : iconName,
  };

  try {
    // Perform the update. We don't need the return value from this call.
    await prisma.subject.update({
      where: { id },
      data: dataToUpdate,
    });

    // After updating, fetch the full object with counts to ensure the client gets the complete data shape.
    const updatedSubjectWithCounts = await getSubjectWithCounts(id);

    return res.status(200).json({
      message: "Subject updated successfully.",
      subject: updatedSubjectWithCounts, // Return the full object with _count
    });
  } catch (err: any) {
    // Handle unique constraint violations (e.g., duplicate subject code or name).
    if (err.code === "P2002") {
      const target = err.meta?.target || "fields";
      return res.status(409).json({
        message: `A subject with this code or name already exists. Failed on: ${target}`,
      });
    }

    // Handle all other errors.
    console.error(`Error updating subject ${id}:`, err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
export const deleteSubject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.subject.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Subject deleted successfully." });
  } catch (err: any) {
    if (err.code === "P2003") {
      return res.status(409).json({
        message:
          "Cannot delete subject. It is still assigned to students or instructors.",
      });
    }
    console.error(`Error deleting subject ${id}:`, err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
