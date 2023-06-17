import express, { Request, Response } from 'express';
import { LogError, LogWarning } from "../utils/Log";
import User from "../models/User";
import MongoDBErrorController from '../utils/MongoDBErrorController';
import sendMail from '../lib/sendMail';
import bcrypt from "bcrypt"


// Instances
const router = express.Router();

// Sign up
router.get("/signup", async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const password = await bcrypt.hash(body.password, 10)
        const createUser = await User.create({ ...body, password });
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
            LogError("/signup", error)
            res.status(500).json({ message: "Server error" })
        }
    }
});

// Sign up
router.get("/login", async (req, res) => {
    try {

    } catch (error) {

    }
});


export default router