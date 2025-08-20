import { Router } from "express";
import {
  createInstructor,
  createQuestion,
  createSubject,
  deleteInstructor,
  deleteQuestion,
  deleteSubject,
  getAllQuestions,
  getAllSubjects,
  getInstructors,
  updateInstructor,
  updateQuestion,
  updateSubject,
} from "../controller/AdminController";

const router = Router();

router.get("/subjects", getAllSubjects);
router.post("/subjects", createSubject);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

router.post("/instructors", createInstructor);
router.get("/instructors", getInstructors);
router.put("/instructors/:id", updateInstructor);
router.delete("/instructors/:id", deleteInstructor);

router.post("/questions", createQuestion);
router.get("/questions", getAllQuestions);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
