import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";



const app = express();
// Render assigns its own port via process.env.PORT; 8080 is only used locally.
const PORT = process.env.PORT || 8080;

app.use(express.json());

// CLIENT_URL should be your deployed Vercel frontend URL in production.
// Falls back to allowing all origins locally so dev keeps working unchanged.
app.use(cors({
    origin: process.env.CLIENT_URL || "*"
}));

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);



app.get("/", (req, res) => {
    res.send("OrionGPT backend is running");
});



app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});



const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
    }
}