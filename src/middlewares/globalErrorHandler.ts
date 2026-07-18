import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client";
import { error } from "node:console";
import { stat } from "node:fs";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log("error: ", err)

    let statusCode
    let errorMessage = err.message || "Internal Server Error " || "Internal Server Error "

    let errorName = err.name || "Internal Server Error "


    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus["400_NAME"]
        const errorMessage = " you have provided incorrect values, please check it again "

    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {

        if (err.code === "p2002") {

            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "duplicate key error"

        } else if (err.code === "p2003") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = " foreign key constraint failed "
        } else if (err.code === "p2005") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "  an operation failed bcz it depends on one or more records that were required but not found "
        }

    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        // statusCode = httpStatus.INTERNAL_SERVER_ERROR,
        //     errorMessage= "Authentication error"

        if (err.errorCode === "p1000") {
            statusCode = httpStatus.UNAUTHORIZED,
                errorMessage= " AAuthenticaation failed against database server"
        } else if (err.errorCode === "p1001") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage= "cant reach database server"
        }
        
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {

        statusCode = httpStatus.INTERNAL_SERVER_ERROR,
            
            errorMessage= " error occured during query time"
            
    }
















    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
        error: err.stack,
        name: errorName
    });

}