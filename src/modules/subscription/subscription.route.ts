import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/checkout",

    auth(Role.Admin, Role.User, Role.Author),


    subscriptionController.createCheckoutSession
)

router.post("/webhook", subscriptionController.handleWebhook)


router.get("/status",
    auth(Role.Admin, Role.User, Role.Author),
    subscriptionController.getSubscriptionStatus)




export const subscriptionRoutes = router