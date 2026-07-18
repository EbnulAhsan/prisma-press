import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log("error: ", err)

    
















    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
        error: err
    });

}