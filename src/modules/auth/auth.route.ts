import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();


//  auth login route 

router.post("/login", authController.loginUser);

//  creating new route for generating new refresh token for user after expired the previous one

router.post("/refresh-token", authController.refreshToken)

export const authRoutes = router;