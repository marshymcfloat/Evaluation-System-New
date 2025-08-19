import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();

    if (!subjects) {
      return res.status(404).json({ message: "There are no subjects found" });
    }

    return res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getInstructors = async (req: Request, res: Response) => {
  try {
    const instructorsWithJoinTable = await prisma.instructor.findMany({
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const instructors = instructorsWithJoinTable.map((instructor) => {
      return {
        ...instructor,

        subjects: instructor.subjects.map(
          (instructorSubject) => instructorSubject.subject
        ),
      };
    });

    return res.status(200).json(instructors);
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

export const createSubject = async (req: Request, res: Response) => {
  const { subjectCode, name } = req.body;

  if (!subjectCode || !name) {
    return res
      .status(400)
      .json({ message: "subjectCode and name are required." });
  }

  try {
    const newSubject = await prisma.subject.create({
      data: {
        subjectCode,
        name,
      },
    });

    return res.status(201).json({
      message: "Subject created successfully.",
      subject: newSubject,
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      const target = err.meta?.target || "fields";
      return res.status(409).json({
        message: `A subject with this code or name already exists. Failed on: ${target}`,
      });
    }

    console.error("Error creating subject:", err);
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
        createdAt: "desc",
      },
    });
    return res.status(200).json(questions);
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
