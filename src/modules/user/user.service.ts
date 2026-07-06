
import { prisma } from "../../lib/prisma";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";
import { stringify } from "node:querystring";
import { profile } from "node:console";

// function for async


const registerUserIntoDB = async (payload: RegisterUserPayload) => {
    const { name, email, password, profilePhoto } = payload;
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
            profile: {
                create: {
                    profilePhoto,

                }

            }
        },
    });

    // await prisma.profile.create({
    //     data: {
    //         userID: createdUser.id,
    //         profilePhoto,
    //     },
    // });

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


const getMyProfileFromDB = async (userId: string) => {

    const user = await prisma.user.findFirstOrThrow({
        where: { id: userId },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })

    return user


}



const updateMyProfileFromDB = async (userId: string, payload: any) => {

    const { name, email, profilePhoto, bio } = payload


    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            email,
            profile: {
                update: {
                    profilePhoto,
                    bio
                }
            }
        },

        omit: {
            password: true,
        },
        include: {
            profile: true
        }

    })
}

























export const userService = {
    registerUserIntoDB, getMyProfileFromDB, updateMyProfileFromDB
}