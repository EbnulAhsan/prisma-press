import { Request, NextFunction, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/senResponse";
import { ok } from "node:assert";
import httpStatus from "http-status"


const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.user?.id

        const result = await subscriptionService.createCheckoutSession(userId as string)

        // sending response

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "checkout result is successfully printed ",
            data: result
        })



    }
)

// controller for webhook

const handleWebhook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        
    }
)












export const subscriptionController = {
    createCheckoutSession, handleWebhook
}














