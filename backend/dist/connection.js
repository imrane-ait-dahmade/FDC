import mongoose from "mongoose";
export default class Connection {
    constructor(Url) {
        mongoose.connect(Url)
            .then(() => {
            console.log("Database connected successfully");
        })
            .catch((error) => {
            console.error("Database connection error:", error);
            process.exit(1);
        });
    }
}
