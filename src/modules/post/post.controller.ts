import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/senResponse";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
import { CommentStatus } from "../../../generated/prisma/enums";



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

const getPostById = async (postId: string) => {



    // const postId = req.params.postId

    // if (!postId) {
    //     throw new Error("Post id Required")
    // }

    // const result = await postService.getPostById(postId as string)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "post retrived successfully",
    //     data: result
    // })


    // implementation of transaction and rollback----------

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            })

            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId
                },

                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },

                    comments: {
                        where: {
                            status: CommentStatus.APPROVED
                        },

                        orderBy: {
                            createdAt: "desc"
                        }


                    },

                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            })

            return post



        }
    )

    return transactionResult




}


// update the post
const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const authorId = req.user?.id
    const isAdmin = req.user?.role === "Admin"

    const postId = req.params.postId
    const payload = req.body



    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "post updated successfully",
        data: result
    })







})


// delete the post
const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const authorId = req.user?.id
    const isAdmin = req.user?.role === "Admin"

    const postId = req.params.postId

    if (!postId) {
        throw new Error("Post id Required")
    }


    const result = await postService.deletePost(postId as string, authorId as string, isAdmin)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "post deleted  successfully",
        data: result
    })


})

// get the post stats

const getPostsStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

// get my post

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const authorId = req.user?.id

    const result = await postService.getMyPosts(authorId as string)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My post retrived successfully",
        data: result
    })

})


export const postController = {
    createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsStats, getMyPosts
}




