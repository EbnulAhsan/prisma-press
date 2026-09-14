// import { NextFunction, Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { postService } from "./post.service";
// import { sendResponse } from "../../utils/senResponse";
// import httpStatus from "http-status"
// import { prisma } from "../../lib/prisma";
// import { CommentStatus } from "../../../generated/prisma/enums";



// // create post 
// const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.user?.id

//     const payload = req.body

//     const result = await postService.creatPost(payload, id as string)

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "post created successfully",
//         data: result
//     })

// })


// //  get all post
// const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


//     const query = req.query




//     const result = await postService.getAllPosts(query)

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "post retrived successfully",
//         data: result.data,
//         meta: result.meta
//     })




// })


// // get the posy by user id 

// const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const postId = req.params.postId;

//     if (!postId) {
//         throw new Error("Post Id Required In Params")
//     }

//     const result = await postService.getPostById(postId as string);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Post retrieved successfuly",
//         data: result
//     })
// })


// // update the post
// const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const authorId = req.user?.id
//     const isAdmin = req.user?.role === "Admin"

//     const postId = req.params.postId
//     const payload = req.body



//     const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin)

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "post updated successfully",
//         data: result
//     })







// })


// // delete the post
// const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const authorId = req.user?.id
//     const isAdmin = req.user?.role === "Admin"

//     const postId = req.params.postId

//     if (!postId) {
//         throw new Error("Post id Required")
//     }


//     const result = await postService.deletePost(postId as string, authorId as string, isAdmin)

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "post deleted  successfully",
//         data: result
//     })


// })

// // get the post stats

// const getPostsStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const result = await postService.getPostsStats()

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "post  stats retrived successfully",
//         data: result
//     })




// })

// // get my post

// const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const authorId = req.user?.id

//     const result = await postService.getMyPosts(authorId as string)


//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "My post retrived successfully",
//         data: result
//     })

// })


// export const postController = {
//     createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsStats, getMyPosts
// }




import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/senResponse";
import httpStatus from "http-status";

// create post 
const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // JWT টোকেন থেকে পাওয়া ইউজার আইডি
    const userId = req.user?.id;
    const payload = req.body;

    // ইউজার আইডি না থাকলে শুরুতেই রিকোয়েস্ট আটকে দেবে
    if (!userId) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: "Unauthorized! User ID is missing or token is invalid.",
            data: null,
        });
    }

    const result = await postService.creatPost(payload, userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post created successfully",
        data: result
    });
});

// get all post
const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await postService.getAllPosts(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK, // GET রিকোয়েস্টে সাধারণত OK (200) হয়
        message: "Post retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

// get post by id 
const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
        throw new Error("Post Id Required In Params");
    }

    const result = await postService.getPostById(postId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post retrieved successfully",
        data: result
    });
});

// update post
const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "Admin";
    const postId = req.params.postId;
    const payload = req.body;

    if (!authorId) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: "Unauthorized access",
            data: null,
        });
    }

    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post updated successfully",
        data: result
    });
});

// delete post
const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "Admin";
    const postId = req.params.postId;

    if (!postId) {
        throw new Error("Post Id Required");
    }

    const result = await postService.deletePost(postId as string, authorId as string, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post deleted successfully",
        data: result
    });
});

// get post stats
const getPostsStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostsStats();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post stats retrieved successfully",
        data: result
    });
});

// get my post
const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    if (!authorId) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: "Unauthorized access",
            data: null,
        });
    }

    const result = await postService.getMyPosts(authorId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My post retrieved successfully",
        data: result
    });
});

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsStats,
    getMyPosts
};