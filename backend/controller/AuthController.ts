import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const handleAuthLogin = async (req: Request, res: Response) => {
  try {
    const { identifier, password, role } = req.body;

    // ... (Your validation code remains the same)
    if (!identifier || !password || !role) {
      return res
        .status(400)
        .json({ message: "Identifier, password, and role are required." });
    }

    let user: any = null;

    // ... (Your switch statement to find the user remains the same)
    switch (role.toLowerCase()) {
      case "student":
        user = await prisma.student.findUnique({
          where: { studentID: identifier },
        });
        break;
      case "instructor":
        user = await prisma.instructor.findUnique({
          where: { instructorID: identifier },
        });
        break;
      case "admin":
        user = await prisma.admin.findUnique({
          where: { adminID: identifier },
        });
        break;
      default:
        return res
          .status(400)
          .json({ message: "Invalid user role specified." });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // --- NEW JWT LOGIC STARTS HERE ---

    // 7. Generate a JWT
    const tokenPayload = {
      id: user.id, // The user's unique ID from the database
      role: role, // The user's role
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // This is an important check for server health
      throw new Error(
        "JWT_SECRET is not defined in the environment variables."
      );
    }

    const token = jwt.sign(tokenPayload, secret, {
      expiresIn: "1d", // The token will expire in 1 day
    });

    // --- JWT LOGIC ENDS ---

    const { password: _, ...userWithoutPassword } = user;

    // 8. Send the token back to the client along with user data
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      role: role,
      token: token, // <-- Include the token in the response
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const handleAuthRegister = async (req: Request, res: Response) => {
  try {
    console.log("meow");
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res
        .status(400)
        .json({ message: "Identifier, password, and role are required." });
    }

    let existingUser: any = null;
    switch (role.toLowerCase()) {
      case "student":
        existingUser = await prisma.student.findUnique({
          where: { studentID: identifier },
        });
        break;
      case "instructor":
        existingUser = await prisma.instructor.findUnique({
          where: { instructorID: identifier },
        });
        break;
      case "admin":
        existingUser = await prisma.admin.findUnique({
          where: { adminID: identifier },
        });
        break;
      default:
        return res
          .status(400)
          .json({ message: "Invalid user role specified." });
    }

    if (existingUser) {
      return res
        .status(409)
        .json({ message: `A user with this ID already exists as a ${role}.` });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser: any = null;
    switch (role.toLowerCase()) {
      case "student":
        newUser = await prisma.student.create({
          data: {
            studentID: identifier,
            password: hashedPassword,
          },
        });
        break;
      case "instructor":
        newUser = await prisma.instructor.create({
          data: {
            instructorID: identifier,
            password: hashedPassword,
          },
        });
        break;
      case "admin":
        newUser = await prisma.admin.create({
          data: {
            adminID: identifier,
            password: hashedPassword,
          },
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
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};
