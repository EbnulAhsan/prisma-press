import { NextFunction, Router, Request, Response } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middlewares/auth";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { subscriptionGuard } from "../../middlewares/PremiumGuard";



const router = Router()

router.get(
    "/",
    auth(Role.Admin, Role.Author, Role.User),

    subscriptionGuard(),




    premiumController.getPremiumContent


)

















export const premiumRoutes = router