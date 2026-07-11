import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"

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
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            views: {
                increment: 1
            }
        },

        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return updatedPost

}


const updatePost = () => {

}

const deletePost = () => {

}


const getPostsStats = () => {

}

const getMyPosts = () => {

}

export const postService = {
    creatPost, getAllPosts, getPostById, updatePost, deletePost, getPostsStats, getMyPosts
}