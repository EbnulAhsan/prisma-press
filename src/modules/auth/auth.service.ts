import { IloginUser } from "./auth.interface"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"
import config from "../../config";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";
import { emitWarning } from "node:process";


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


const refreshToken = async (refreshToken: string) => {

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret)


    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.error)
    }

    const { id } = verifiedRefreshToken.data as JwtPayload

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    if (user.activeStatus === "Blocked") {
        throw new Error(" user is blocked ")
    }


    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role:user.role

    }


    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expiration)
    

    return {accessToken}
    
}










export const authService = {
    loginUser, refreshToken
}