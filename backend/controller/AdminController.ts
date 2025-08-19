import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();

    if (!subjects) {
      return res.status(404).json({ message: "There is no subjects found" });
    }

    return res.status(200).json(subjects);
  } catch (err) {}
};
