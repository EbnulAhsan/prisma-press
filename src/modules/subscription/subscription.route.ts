import { Router } from "express";
import { subscriptionController } from "./subscription.controller";

const router = Router()

router.post("/checkout", subscriptionController.createCheckoutSession)

export const subscriptionRoutes = router