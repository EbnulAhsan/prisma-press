
import { prisma } from "../../lib/prisma";
import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/senResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";
import { send } from "node:process";




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


const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    console.log("Access token:", accessToken);


    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)


    if (typeof verifiedToken === 'string') {
        throw new Error("varified token ")
    }

    const profile = await userService.getMyProfileFromDB(verifiedToken.id)
        
        
        
        
        
        
    // if (!accessToken) {
    //     return sendResponse(res, {
    //         success: false,
    //         statusCode: httpStatus.UNAUTHORIZED,
    //         message: "Access token not found. Please login first.",
    //         data: null,
    //     });
    // }

    // const verifiedToken = jwtUtils.verifyToken(
    //     accessToken,
    //     config.jwt_access_secret
    // ) as JwtPayload;

    // console.log("Verified token:", verifiedToken);

    // return sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Profile retrieved successfully.",
    //     data: verifiedToken,
    // });


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "user profile fetched successfully",
        data:{profile}
    })




});




export const userController = {
    RegisterUser, getMyProfile
}