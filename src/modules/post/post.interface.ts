import { PostStatus } from "../../../generated/prisma/enums";
import { postWhereInput } from "../../../generated/prisma/models";

export interface ICreatePostPayload {
    title: string,
    content: string,
    thumbnail?: string,
    isFeatured?: boolean,
    status?: PostStatus
    tags: string[]
}

export interface IUpdatePostPayload {
    title?: string,
    content?: string,
    thumbnail?: string,
    isFeatured?: boolean,
    status?: PostStatus
    tags?: string[]
}


export interface IpostQuery extends postWhereInput {
    //  post model fields


    // title?: string,
    // content?: string,


    page?: string,
    limit?: string,
    sortOrder?: string,
    sortBy?: string
    searchTerm?: string
}
