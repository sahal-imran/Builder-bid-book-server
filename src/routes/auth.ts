import express, { Request, Response } from 'express';
import { LogError, LogInfo, LogWarning } from "../utils/Log";
import User from "../models/User";
import MongoDBErrorController from '../utils/MongoDBErrorController';
import sendMail from '../lib/sendMail';
import Session from '../models/Session';
import jwt from "jsonwebtoken";
import md5 from 'md5';
import OTPGenerator from '../utils/OtpGenerator';
import Verification from '../models/Verification';
import authenticate from '../middleware/authenticate';

// Instances
const router = express.Router();

interface IRequest extends Request {
    user: any;
}

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
            res.status(errorHandler?.status).json({ message: errorHandler.message })
        }
        else if (errorHandler.status === 409) {
            LogWarning("/signup(Duplication)", errorHandler.message)
            res.status(errorHandler?.status).json({ message: errorHandler.message })
        }
        else {
            LogError("(auth)/signup", error)
            res.status(500).json({ message: "Server error" })
        }
    }
});

// Login up
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const currentUser = await User.findOne({ companyEmail: email })
        if (currentUser) {
            const match = md5(password) === currentUser.password;
            if (match) {
                let token = jwt.sign({ _id: currentUser._id }, process.env.SECRET_KEY);
                await Session.create({ token, user: currentUser?._id, expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }); // store token in Session collection which will expire in 30min
                res.cookie('jwToken', token, {
                    maxAge: 86400000, // Cookie expiration time (in milliseconds)
                    httpOnly: true, // Restrict cookie access to HTTP only
                    secure: process.env.MODE === 'production', // Set to true for deployment (HTTPS), false for localhost (HTTP)
                    sameSite: process.env.MODE === 'production' ? 'none' : 'lax', // Set to 'Lax' for localhost, 'none' for deployment to allow cross-site cookies
                });
                res.status(200).json({ message: "successfully logged in", role: currentUser?.role })
            }
            else res.status(401).json({ message: "Invalid password" }) // Unauthorized
        }
        else res.status(401).json({ message: "Email not exist" }) // Unauthorized
    } catch (error) {
        LogError("(auth)/login", error)
        res.status(500).json({ message: "Server error" })
    }
});

// Logout 
router.post("/logout", async (req: IRequest, res: Response) => {
    try {
        const token: string = req.cookies.jwToken;
        await Session.findOneAndDelete({ token });
        res.clearCookie('role');
        res.clearCookie('jwToken');
        res.status(200).json({ message: "logged out" })
    } catch (error) {
        LogError("(auth)/logout", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Get code on email
router.post("/getCode", async (req: IRequest, res: Response) => {
    try {
        const { email } = req.body;
        const match = await User.findOne({ companyEmail: email });
        if (!match) {
            res.status(404).json({ message: "Email not exist" });
            return;
        }
        const otp = OTPGenerator();
        const saved = await Verification.create({ otp, user: match?._id, expireAt: new Date(Date.now() + 600000) });
        if (saved) {
            sendMail(match?.companyEmail, "One time OTP", `OTP: ${otp}, don't share it with anyone else`, async (error) => {
                if (error) {
                    LogError("(auth)/getCode", error);
                    await Verification.findByIdAndDelete({ _id: saved._id })
                    res.status(500).json({ message: "Unable to send otp" })
                }
                else {
                    res.status(201).json({ message: "Otp sent", _id: match?._id })
                }
            })
        } else res.status(200).json({ message: "Unable to send otp" })
    } catch (error) {
        LogError("(auth)/getCode", error)
        res.status(500).json({ message: "Server error" })
    }
});

// Verify OTP
router.post("/verifyCode", async (req: IRequest, res: Response) => {
    try {
        const { otp, _id } = req.body;
        const match = await Verification.findOne({ user: _id, otp })
        if (match) res.status(200).json({ message: "Verification successful", _id: match?.user });
        else res.status(401).json({ message: "otp expired" })
    } catch (error) {
        LogError("(auth)/verifyCode", error)
        res.status(500).json({ message: "Server error" })
    }
});

// Password Reset
router.post("/resetPassword", async (req: IRequest, res: Response) => {
    try {
        const { password, _id } = req.body;
        await User.findByIdAndUpdate({ _id }, { password: md5(password), updatedAt: new Date().toISOString(), lastUpdateBy: _id });
        res.status(200).json({ message: "Password recovered successfully" })
    } catch (error) {
        LogError("(auth)/resetPassword", error)
        res.status(500).json({ message: "Server error" })
    }
})

// get role for authorization
router.get("/getRole", authenticate, async (req: IRequest, res: Response) => {
    try {
        res.status(200).json({ role: req?.user?.role })
    } catch (error) {
        LogError("(auth)/getRole", error)
        res.status(500).json({ message: "Server error" })
    }
})


export default router;