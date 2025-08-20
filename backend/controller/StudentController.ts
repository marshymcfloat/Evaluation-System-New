import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export const getStudentSubjectsForEvaluation = async (
  req: Request,
  res: Response
) => {
  // @ts-ignore - Assuming req.user is populated by your auth middleware
  const studentId = req.user.id;

  if (!studentId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const submittedEvaluations = await prisma.evaluation.findMany({
      where: { studentId },
      select: { subjectId: true, instructorId: true },
    });

    const evaluatedSet = new Set(
      submittedEvaluations.map((e) => `${e.subjectId}-${e.instructorId}`)
    );

    const studentSubjects = await prisma.studentSubject.findMany({
      where: { studentId },
      include: {
        subject: {
          include: {
            instructors: {
              include: {
                instructor: true,
              },
            },
          },
        },
      },
      orderBy: {
        subject: { name: "asc" },
      },
    });

    const evaluationList = studentSubjects.flatMap((ss) => {
      // Assuming one instructor per subject for this context
      const instructorLink = ss.subject.instructors[0];
      if (!instructorLink) return [];

      const subject = ss.subject;
      const instructor = instructorLink.instructor;

      const hasEvaluated = evaluatedSet.has(`${subject.id}-${instructor.id}`);

      return {
        subject: {
          id: subject.id,
          name: subject.name,
          subjectCode: subject.subjectCode,
          iconName: subject.iconName, // Include the icon name
        },
        instructor: {
          id: instructor.id,
          name: instructor.name,
        },
        hasEvaluated,
      };
    });

    return res.status(200).json(evaluationList);
  } catch (err) {
    console.error("Error fetching student subjects for evaluation:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
