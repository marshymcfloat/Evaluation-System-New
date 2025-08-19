import { Router } from "express";
import {
  createInstructor,
  createQuestion,
  createSubject,
  deleteQuestion,
  getAllQuestions,
  getAllSubjects,
  getInstructors,
  updateQuestion,
} from "../controller/AdminController";

const router = Router();

router.post("/createSubject", createSubject);
router.get("/getSubjects", getAllSubjects);

router.post("/createInstructor", createInstructor);
router.get("/getInstructors", getInstructors);

router.post("/questions", createQuestion);
router.get("/questions", getAllQuestions);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
