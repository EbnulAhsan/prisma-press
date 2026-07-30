import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/senResponse";
import httpStatus from "http-status"
import { PremiumServices } from "./premium.service";


const getPremiumContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        // const userId= req.user?.id

        const result = await PremiumServices.getPremiumContent

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "premium content Retrived successfully ",
            data: result


        })


    }
)



export const premiumController = {
    getPremiumContent
}