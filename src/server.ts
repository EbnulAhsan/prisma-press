import app from "./app";
import { prisma } from "./lib/prisma";
import "dotenv/config";
import config from "./config";

const PORT = config.port;

async function main() {
    try {

        // await prisma.$connect();
        console.log("Connected to the database successfully.");



        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {

        // await prisma.$disconnect();

        console.error("Error starting the server:", error);
        process.exit(1);

    }
}




//main function call here

main()