import mongoose, { connect } from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};

export default connectDB