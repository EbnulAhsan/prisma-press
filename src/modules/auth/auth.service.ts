import { IloginUser } from "./auth.interface"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"
import config from "../../config";
import jwt, { SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";


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

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,

    }













    // this is for access token generation

    // const accesToken = jwt.sign({ jwtPayload

    // }, config.jwt_access_secret, {
    //     expiresIn : config.jwt_access_expiration

    // }as SignOptions
    // );


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expiration
    )





















    // this is for refresh token generation

    // const refreshToken = jwt.sign({
    //     jwtPayload

    // }, config.jwt_refresh_secret, {

    //     expiresIn: config.jwt_refresh_expiration




    // } as SignOptions
    // );



    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expiration
    );








    return {
        accessToken, refreshToken
    };


}


export const authService = {
    loginUser,
}