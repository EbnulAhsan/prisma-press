import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/senResponse";



const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;

    const { accessToken, refreshToken } = await authService.loginUser(payload);


    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 *24 // 1 day in ms
    })


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7// 7 day in ms
    })















    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successful.",
        data: {
            accessToken, refreshToken
        }
    });











})


const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;


    
})

















export const authController = {
    loginUser,refreshToken
}
