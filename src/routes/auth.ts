import express, { Request, Response } from 'express';
import { LogError, LogInfo, LogWarning } from "../utils/Log";
import User from "../models/User";
import MongoDBErrorController from '../utils/MongoDBErrorController';
import sendMail from '../lib/sendMail';
import Session from '../models/Session';
import jwt from "jsonwebtoken";
import md5 from 'md5';



// Instances
const router = express.Router();

// Sign up
router.post("/signup", async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const createUser = await User.create({ ...body, password: md5(body.password) });
        sendMail(createUser?.companyEmail, "Welcome", "Hi Welcome to the app", (error) => {
            if (error) LogError("/signup(sendMail)", error)
            res.status(201).json({ message: "Registered" })
        })
    } catch (error) {
        const errorHandler: any = MongoDBErrorController(error)
        if (errorHandler.status === 403) {
            LogWarning("/signup(Validation)", errorHandler.message)
            res.status(errorHandler.status).json({ message: errorHandler.message })
        }
        else if (errorHandler.status === 409) {
            LogWarning("/signup(Duplication)", errorHandler.message)
            res.status(errorHandler.status).json({ message: errorHandler.message })
        }
        else {
            LogError("(auth)/signup", error)
            res.status(500).json({ message: "Server error" })
        }
    }
});

// Login up
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const currentUser = await User.findOne({ companyEmail: email })
        if (currentUser) {
            const match = md5(password) === currentUser.password;
            if (match) {
                let token = jwt.sign({ _id: currentUser._id }, process.env.SECRET_KEY);
                const userSession = await Session.create({ token }); // store token in Session collection which will expire in 30min
                await User.findByIdAndUpdate({ _id: currentUser._id }, { currentSession: userSession._id })
                res.cookie('jwToken', token, {
                    maxAge: 1800000, // Cookie expiration time (in milliseconds)
                    httpOnly: true, // Restrict cookie access to HTTP only
                    secure: process.env.MODE === 'production', // Set to true for deployment (HTTPS), false for localhost (HTTP)
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Set to 'Lax' for localhost, 'none' for deployment to allow cross-site cookies
                });
                res.status(200).json({ message: "welcome" })
            }
            else res.status(401).json({ message: "Invalid password" }) // Unauthorized
        }
        else res.status(401).json({ message: "Email not exist" }) // Unauthorized
    } catch (error) {
        LogError("(auth)/login", error)
        res.status(500).json({ message: "Server error" })
    }
});


export default router