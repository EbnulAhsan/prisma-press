import { PrismaClientValidationError } from "@prisma/client/runtime/client"
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface"
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { text } from "node:stream/consumers"

const creatPost = async (payload: ICreatePostPayload, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result



}

const getAllPosts = async () => {

    const posts = await prisma.post.findMany(
        {
            include: {
                author: {
                    omit: {
                        password: true
                    }

                },
                comments: true
            }
        }
    );

    return posts

}



const getPostById = async (postId: string) => {

    // await prisma.post.update({
    //     where : {
    //         id : postId,
    //     },
    //     data : {
    //         views : {
    //             increment : 1
    //         },
    //     }
    // })

    // throw new Error("Fake Error")

    // const post = await prisma.post.findUniqueOrThrow({
    //     where : {
    //         id : postId
    //     },

    //     include : {
    //         author : {
    //             omit : {
    //                 password : true
    //             }
    //         },

    //         comments : {
    //             where : {
    //                 status : CommentStatus.APPROVED
    //             },

    //             orderBy : {
    //                 createdAt : "desc"
    //             }
    //         },

    //         _count : {
    //             select : {
    //                 comments : true
    //             }
    //         }
    //     }
    // })

    // return post

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId,
                },
                data: {
                    views: {
                        increment: 1
                    },
                }
            });
            // throw new Error("fake error")
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
            });
            return post
        }
    );

    return transactionResult

}


const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {

    const post = await prisma.post.
        findFirstOrThrow({
            where: {
                id: postId

            }
        })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("you are not the owner of this post ")

    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return result


}

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {

    // find the post 
    const post = await prisma.post.
        findFirstOrThrow({
            where: {
                id: postId

            }
        })

    // check is he admin or author 
    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("you are not the owner of this post ")

    }

    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    })

    // return null // j post delete oitaa dhore return kora  is not a optimise work

    // for see we return the result 

    return result

}


const getPostsStats = async () => {

    const transactionResult = await prisma.$transaction(
        async (tx) => {

            //     const totalPosts = await tx.post.count()

            //     const totalPublishedPosts = await tx.post.count({
            //         where: {
            //             status: PostStatus.PUBLISHED
            //         }
            //     })

            //     const totalDraftPosts = await tx.post.count({
            //         where: {
            //             status: PostStatus.DRAFT
            //         }
            //     })


            // const totalArchivedPosts = await tx.post.count({
            //     where: {
            //         status: PostStatus.ARCHIVED

            //     }
            // })

            //     const totalComments = await tx.comment.count()

            // const totalApprovedComments = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.APPROVED
            //     }
            // })

            // const totalRejectedComments = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.REJECT
            //     }
            // })


            //     // total views shwon on postman bt its not a good approach though

            //     // const allPosts = await tx.post.findMany()

            //     // let totalPostViews = 0

            //     // allPosts.forEach((post) => {

            //     //     totalPostViews = totalPostViews + post.views



            //     // })

            //     //  now total post view with direct connecting with prisma 

            // const totalPostViewsAggregate = await tx.post.aggregate({
            //     _sum: {
            //         views: true
            //     }
            // })

            //     const totalPostViews = totalPostViewsAggregate._sum.views


            // return {
            //     totalPosts, totalPublishedPosts, totalDraftPosts, totalArchivedPosts, totalComments, totalApprovedComments, totalRejectedComments,totalPostViews

            // }


            // usuing the best approach


            const [totalPosts, totalPublishedPosts, totalDraftPosts, totalArchivedPosts, totalComments, totalApprovedComments, totalRejectedComments, totalPostViewsAggregate
            ] = await Promise.all([
                await tx.post.count(),
                await tx.post.count({
                    where: {
                        status: PostStatus.PUBLISHED
                    }


                }),


                await tx.post.count({
                    where: {
                        status: PostStatus.DRAFT
                    }
                }),


                await tx.post.count({
                    where: {
                        status: PostStatus.ARCHIVED

                    }
                }),

                await tx.comment.count(),


                await tx.comment.count({
                    where: {
                        status: CommentStatus.APPROVED
                    }
                }),

                await tx.comment.count({
                    where: {
                        status: CommentStatus.REJECT
                    }
                }),

                await tx.post.aggregate({
                    _sum: {
                        views: true
                    }
                })






            ])

            return {
                totalPosts, totalPublishedPosts, totalDraftPosts, totalArchivedPosts, totalComments, totalApprovedComments, totalRejectedComments, 
                totalPostViews  : totalPostViewsAggregate._sum.views

            }



        }
    )

    return transactionResult



}





const getMyPosts = async (authorId: string) => {

    const result = await prisma.post.findMany({
        where: {
            authorId
        },

        // sorting

        orderBy: {
            createdAt: "desc"

        },

        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },

            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    return result

}

export const postService = {
    creatPost, getAllPosts, getPostById, updatePost, deletePost, getPostsStats, getMyPosts
}