import { Router } from "express";
import {
  handleAuthLogin,
  handleAuthRegister,
} from "../controller/AuthController";

const router = Router();

router.post("/login", handleAuthLogin);

router.post("/register", handleAuthRegister);
export default router;
