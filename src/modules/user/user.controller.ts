
import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import { userService } from "./user.service";





const RegisterUser = async (req: Request, res: Response) => {

    try {
        const payload = req.body;

        const user = await userService.registerUserIntoDB(payload);


        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User registration successful.",
            data: {
                user
            },
        });

    } catch (error) { 

        console.error("Error registering user:", error);

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "An error occurred during user registration.",
            error: error instanceof Error ? error.message : "Unknown error",
        });

    }
    
} 


export const userController = {
    RegisterUser,
}