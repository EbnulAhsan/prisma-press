import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/senResponse";



const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;

    const loginResult = await authService.loginUser(payload);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successful.",
        data: loginResult
    });











})


export const authController = {
    loginUser,
}
