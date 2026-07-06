import { NextFunction, Router, } from "express";
import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { Jwt, JwtPayload } from "jsonwebtoken";
import { auth } from "../../middlewares/auth";


const router = Router();













router.post("/register", userController.RegisterUser);


//  new optimise fuction  create for --





router.get("/me",

    //     (req: Request, res: Response, next: NextFunction) => {

    //     console.log(req.cookies)
    //     const { accessToken } = req.cookies;

    //     console.log("Access token:", accessToken);


    //     const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)

    //     if (!verifiedToken.success) {
    //         throw new Error("verifiedToken.error")
    //     }
















    //     const { email, name, id, role } = verifiedToken.data as JwtPayload









    //     // const requiredRoles = ["ADMIN", "USER", "AUTHOR"]

    //     const requiredRoles = [Role.Admin, Role.Author, Role.User]

    //     if (!requiredRoles.includes(role)) {
    //         return res.status(403).json({
    //             success: false,
    //             statusCode: httpStatus.FORBIDDEN,
    //             message: "Forbidden, you dont have permission to access this resource"
    //         })
    //     }

    //     req.user = {
    //         email, name, id, role 
    //     }





    //     next()

    // },


    auth(Role.Admin, Role.User, Role.Author),





    userController.getMyProfile)



// update api for user
    

router.put("/my-profile", auth(Role.Admin, Role.Author, Role.User),
userController.updateMyProfile)

export const userRoutes = router;