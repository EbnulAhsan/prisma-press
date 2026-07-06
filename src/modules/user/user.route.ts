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


const router = Router();


declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string,
                name: string
                id: string
                role: Role
            }
        }
    }
}










router.post("/register", userController.RegisterUser);


//  new optimise fuction  create for --


const auth = (...requiredRoles :Role []) => {





    
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies.accessToken ? req.cookies.accessToken: req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split("  ")[1] : req.headers.authorization


        if (!token) {
            throw new Error("you are not logged in, please log in to access the resource")
        }

        // now for verified token ---

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret)

       
        if (!verifiedToken.success) {
            throw new Error("verifiedToken.error")
        }



        const { email, name, id, role } = verifiedToken.data as JwtPayload


        if (requiredRoles.length &&  !requiredRoles.includes(role)) {
            throw new Error("Forbidden you dont have permission to access this resource ")
        }



        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role

            }
        })

        if (!user) {
            throw new Error ("user not found. please log in agian ")
        }


        if (user.activeStatus === "Blocked") {
            throw new Error(" Your account has been blocked. please contact to our customer support .")
        }


        req.user = {
            email,
            name,
            id,
            role
        }

        next()


    }
    )
}


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

export const userRoutes = router;