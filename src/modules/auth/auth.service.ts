import { IloginUser } from "./auth.interface"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"
import config from "../../config";
import jwt from "jsonwebtoken";


const loginUser = async (payload: IloginUser) => {


    const { email, password } = payload;

    // const user = await prisma.user.findUnique({
    //     where: {
    //         email
    //     }
    // });

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    })


    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password.");
    }


    // this is for access token generation

    const accesToken = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, "accessSecret", {
        expiresIn : "1d"

    });


    // this is for refresh token generation

    const refreshToken = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, "refreshSecret", {
        expiresIn: "7d"
    });









    return {
        accesToken, refreshToken
    };


}


export const authService = {
    loginUser,
}