import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();


//  auth login route 

router.post("/login", authController.loginUser);

export const authRoutes = router;