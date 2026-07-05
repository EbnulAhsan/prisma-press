import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: config.app_url,
        credentials: true,
    })
);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

// Register User
app.post("/api/users/register", async (req: Request, res: Response) => {
    const { name, email, password, profilePhoto } = req.body;

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

    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registration successful.",
        data: user,
    });
});

export default app;