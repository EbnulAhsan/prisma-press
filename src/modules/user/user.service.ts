
import { prisma } from "../../lib/prisma";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";





const registerUserIntoDB = async (payload: RegisterUserPayload) => { const { name, email, password, profilePhoto } = payload;
    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds)
    );

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    await prisma.profile.create({
        data: {
            userID: createdUser.id,
            profilePhoto,
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email,
        },

        omit: {
            password: true,
        },





        include: {
            profile: true,
        },
    });

    return user;    
}


export const userService = {
    registerUserIntoDB,
}