// import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// const createToken = (
//     payload: JwtPayload,
//     secret: string,
//     expiresIn: SignOptions["expiresIn"]
// ) => {
//     const token = jwt.sign(payload, secret, {
//         expiresIn,
//     });

//     return token;
// };

// export const jwtUtils = {
//     createToken,
// };



import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
    payload: JwtPayload,
    secret: Secret,
    expiresIn: SignOptions["expiresIn"]
) => {
    return jwt.sign(payload, secret, {
        expiresIn,
    });
};


const verifyToken = (token: string, secret: string) => {


    try {
        const verifiedToken = jwt.verify(token, secret)
        return {
            success: true,
            data: verifiedToken
        }

    } catch (error: any) {

        console.log("token verification failed ", error)

        return {
            success: false,
            error: error.message
        }


    };

}














export const jwtUtils = {
    createToken, verifyToken
};