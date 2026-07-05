
import { prisma } from "../../lib/prisma";
import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/senResponse";




const RegisterUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload);

   

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registration successful.",
        data: {
            user
        },
    });

})


export const userController = {
    RegisterUser,
}