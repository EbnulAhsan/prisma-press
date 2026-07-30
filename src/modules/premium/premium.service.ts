import { postWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { IpostQuery } from "../post/post.interface"


const getPremiumContent = async (query: IpostQuery) => {

     const limit = query.limit ? Number(query.limit) : 10
        const page = query.page ? Number(query.page) : 1
        const skip = (page - 1) * limit
        const sortBy = query.sortBy ? query.sortBy : "createdAt"
        const sortOrder = query.sortOrder ? query.sortOrder : "desc"
    
        const tags = query.tags ? JSON.parse(query.tags as string) : null
        const tagsArray = Array.isArray(tags) ? tags : []
    
    
        const andConditions: postWhereInput[] = []
    
        if (query.searchTerm) {
            andConditions.push({
                OR: [
                    {
                        title: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
    
                    },
    
                    {
                        content: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    }
    
                ]
            })
        }
    
    
        if (query.title) {
            andConditions.push({
                title: query.title
            })
        }
    
        if (query.content) {
            andConditions.push({
                content: query.content
            })
        }
    
        if (query.authorId) {
            andConditions.push({
                authorId: query.authorId
            })
        }
    
        if (query.isFeatured) {
            andConditions.push({
                isFeatured: Boolean(query.isFeatured)
            })
        }
    
        if (query.tags) {
            andConditions.push({
                tags: {
                    hasSome: tagsArray
                }
            })
        }
    
    
        if (query.status) {
            andConditions.push({
                status: query.status
            })
        }
    


    const posts = await prisma.post.findMany({
        where: {
            isPremium: true
        }




    })
    return posts

}








export const PremiumServices = {
    getPremiumContent
}