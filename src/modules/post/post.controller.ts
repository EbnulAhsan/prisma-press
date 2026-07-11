import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/senResponse";
import httpStatus from "http-status"



// create post 
const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id

    const payload = req.body

    const result = await postService.creatPost(payload, id as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "post created successfully",
        data: result
    })

})


//  get all post
const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    

    const result = await postService.getAllPosts()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "post retrived successfully",
        data: result
    })



})


// get the posy by user id 

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


// update the post
const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


// delete the post
const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

// get the post stats

const getPostsStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

// get my post

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


export const postController = {
    createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsStats, getMyPosts
}




















