import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";



// create post 
const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
})


//  get all post
const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

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




















