import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({error: "All fields are required"});
    }

    if(password.length < 6) {
        return res.status(400).json({error: "Password must be at least 6 characters"});
    }

    try {
        const existingUser = await User.findOne({email: email.toLowerCase()});
        if(existingUser) {
            return res.status(409).json({error: "An account with this email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, email: email.toLowerCase(), password: hashedPassword});
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {id: user._id, username: user.username, email: user.email}
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Signup failed"});
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }

    try {
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user) {
            return res.status(401).json({error: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({error: "Invalid email or password"});
        }

        const token = generateToken(user._id);
        res.json({
            token,
            user: {id: user._id, username: user.username, email: user.email}
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Login failed"});
    }
});

export default router;