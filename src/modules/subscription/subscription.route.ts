import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/checkout",

    auth(Role.Admin, Role.User, Role.Author),


    subscriptionController.createCheckoutSession)

export const subscriptionRoutes = router