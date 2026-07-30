import { Router } from "express";
import { PremiumController } from "./premium.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";



const router = Router()

router.get(
    "/",
    auth(Role.Admin, Role.Author, Role.User),
    PremiumController.getPremiumContent

    
)

















export const  PremiumRoutes= router