import { prisma } from "../../lib/prisma"


const getPremiumContent = async () => {
    const post = await prisma.post.findMany({


        

    })

}








export const PremiumServices = {
    getPremiumContent
}