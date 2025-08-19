import { Router } from "express";
import { getStudentSubjectsForEvaluation } from "../controller/StudentController";
import { authenticateToken } from "../middleware/authMiddleware";
const router = Router();

router.get(
  "/subjects-for-evaluation",
  authenticateToken,
  getStudentSubjectsForEvaluation
);

export default router;
