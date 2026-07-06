import { Router, } from "express";
import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import { userController } from "./user.controller";


const router = Router();


router.post("/register", userController.RegisterUser);


router.get("/me", userController.getMyProfile)

export const userRoutes = router;