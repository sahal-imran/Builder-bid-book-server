import express, { Request, Response } from 'express';
import { LogError, LogInfo, LogWarning } from '../utils/Log';
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
        if (req?.user?.role !== "generalContractor") res.status(401).json({ message: "Oops! Unauthorized" }) // Unauthorized
        const newPost = req.body;
        await Post.create({ ...newPost, gc: req?.user?._id });
        res.status(201).json({ message: "Post created successfully" })
    } catch (error) {
        const errorHandler: any = MongoDBErrorController(error)
        if (errorHandler?.status === 403) {
            LogWarning("/post(Validation)", errorHandler.message)
            res.status(errorHandler.status).json({ message: errorHandler.message })
        }
        else {
            LogError("/post", error)
            res.status(500).json({ message: "Server error" })
        }
    }
})

// Get all posts with pagination
router.get("/post", authenticate, async (req: IRequest, res: Response) => {
    try {
        const { page }: any = req.query.page;
        const pageNumber = parseInt(page)
        const recordsPerPage = 10;
        const posts = await Post.find().limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = await Post.find().count()
        res.status(200).json({ posts, totalRecords })
    } catch (error) {
        LogError("/post/:page", error)
        res.status(500).json({ message: "Server error" })
    }
})

// get Single post by id
router.get("/post/:id", authenticate, async (req: IRequest, res: Response) => {
    try {
        const { id } = req.params;
        const post = await Post.findById({ _id: id })
        res.status(200).json({ post })
    } catch (error) {
        LogError("/postById/:id", error)
        res.status(500).json({ message: "Server error" })
    }
})

// get Single posts by CSI_Division
router.post("/post/CSIDivision", authenticate, async (req: IRequest, res: Response) => {
    try {
        const { page }: any = req.query;
        const pageNumber = parseInt(page)
        const recordsPerPage = 10;
        const filters = req.body;
        const posts = await Post.find(filters).populate("gc").limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = posts.length;
        res.status(200).json({ posts, totalRecords })
    } catch (error) {
        LogError("/post/CSIDivision", error)
        res.status(500).json({ message: "Server error" })
    }
})

export default router