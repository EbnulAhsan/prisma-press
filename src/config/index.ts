import dotenv from "dotenv";
import path from "path";
import { SignOptions } from "jsonwebtoken";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    port: process.env.PORT || 3000,

    database_Url: process.env.DATABASE_URL,
    app_url: process.env.APP_URL,

    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,

    jwt_access_expiration: process.env.JWT_ACCESS_EXPIRATION as SignOptions["expiresIn"],
    jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION as SignOptions["expiresIn"],
    stripe_price_id: process.env.STRIPE_PRICE_ID!,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!

};