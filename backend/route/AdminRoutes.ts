import { Router } from "express";
import { getAllSubjects } from "../controller/AdminController";

const router = Router();

router.get("/getSubjects", getAllSubjects);

export default router;
