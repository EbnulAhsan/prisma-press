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

export const jwtUtils = {
    createToken,
};