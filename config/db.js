import mongoose from "mongoose";

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log('mongoDB connection successfully')
    } catch (err) {
        console.err(`Error:${err.message}`)
        process.exit(1)
    }
}

export default connectdb