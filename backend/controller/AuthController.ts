import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["student", "instructor", "admin"]),
  name: z.string().min(2),
});

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  role: z.enum(["student", "instructor", "admin"]),
});

const findUserByIdentifier = async (identifier: string, role: string) => {
  switch (role.toLowerCase()) {
    case "student":
      return prisma.student.findUnique({ where: { studentID: identifier } });
    case "instructor":
      return prisma.instructor.findUnique({
        where: { instructorID: identifier },
      });
    case "admin":
      return prisma.admin.findUnique({ where: { adminID: identifier } });
    default:
      return null;
  }
};

export const handleAuthLogin = async (req: Request, res: Response) => {
  try {
    const { identifier, password, role } = loginSchema.parse(req.body);

    const user = await findUserByIdentifier(identifier, role);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const tokenPayload = { id: user.id, role: role };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined.");
    }
    const token = jwt.sign(tokenPayload, secret, { expiresIn: "1d" });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      role: role,
      token: token,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input.", issues: err.issues });
    }
    console.error("Login error:", err);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const handleAuthRegister = async (req: Request, res: Response) => {
  try {
    const { identifier, password, role, name } = registerSchema.parse(req.body);

    const existingUser = await findUserByIdentifier(identifier, role);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: `A user with this ID already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    switch (role) {
      case "student":
        newUser = await prisma.student.create({
          data: { studentID: identifier, name, password: hashedPassword },
        });
        break;
      case "instructor":
        newUser = await prisma.instructor.create({
          data: { instructorID: identifier, name, password: hashedPassword },
        });
        break;
      case "admin":
        newUser = await prisma.admin.create({
          data: { adminID: identifier, name, password: hashedPassword },
        });
        break;
    }

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } registered successfully.`,
      user: userWithoutPassword,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input.", issues: err.issues });
    }
    console.error("Registration error:", err);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};
