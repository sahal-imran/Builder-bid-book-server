import express, { Request, Response } from 'express';
import { LogError, LogWarning } from '../utils/Log';
import MongoDBErrorController from '../utils/MongoDBErrorController';
import Post from '../models/Post';
import authenticate from '../middleware/authenticate';

const router = express.Router();

interface IRequest extends Request {
    user: any;
}

// Create post
router.post("/post", authenticate, async (req: IRequest, res: Response) => {
    try {
        if (req?.user?.role !== "generalcontractor") res.status(401).json({ message: "Oops! Unauthorized" }) // Unauthorized
        const newPost = req.body;
        await Post.create({ ...newPost, gc: req?.user?._id });
        res.status(201).json({ message: "Post created successfully" })
    } catch (error) {
        const errorHandler: any = MongoDBErrorController(error)
        if (errorHandler.status === 403) {
            LogWarning("/post(Validation)", errorHandler.message)
            res.status(errorHandler.status).json({ message: errorHandler.message })
        }
        else {
            LogError("/post", error)
            res.status(500).json({ message: "Server error" })
        }
    }
})

export default router