import { IloginUser } from "./auth.interface"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"


const loginUser =async (payload: IloginUser) => { 


    const { email, password } = payload;
    
    // const user = await prisma.user.findUnique({
    //     where: {
    //         email
    //     }
    // });

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    })


    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password.");
    }


    return user;


}


export const authService = {
    loginUser,
}