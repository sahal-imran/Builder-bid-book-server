import express, { Request, Response } from 'express';
import { LogError, LogInfo, LogWarning } from '../utils/Log';
import MongoDBErrorController from '../utils/MongoDBErrorController';
import authenticate from '../middleware/authenticate';
import Bid from '../models/Bid';
import Post from '../models/Post';


const router = express.Router();

interface IRequest extends Request {
    user: any;
}

// Create Bid
router.post("/bid", authenticate, async (req: IRequest, res: Response) => {
    if (req?.user?.role !== "subContractor") {
        res.status(401).json({ message: "Oops! Unauthorized, Sub Contractor can bid only!" }) // Unauthorized
        return;
    }
    try {
        const { postId }: any = req.query;
        const subContractor_ID = req?.user?._id;
        const bid = { ...req.body, post: postId, SC: subContractor_ID }
        await Bid.create(bid);
        res.status(201).json({ message: "Proposal posted successfully" })
    } catch (error) {
        const errorHandler: any = MongoDBErrorController(error)
        if (errorHandler?.status === 403) {
            LogWarning("/Bid(Validation)", errorHandler.message)
            res.status(errorHandler.status).json({ message: errorHandler.message })
        }
        else {
            LogError("/Bid", error)
            res.status(500).json({ message: "Server error" })
        }
    }
})

// Get all bids with pagination
router.get("/bids", authenticate, async (req: IRequest, res: Response) => {
    if (req?.user?.role !== "subContractor") {
        res.status(401).json({ message: "Oops! Unauthorized, Sub Contractor can bid only!" }) // Unauthorized
        return;
    }
    try {
        const { page }: any = req.query.page;
        const pageNumber = parseInt(page)
        const recordsPerPage = 10;
        const bids = await Bid.find().limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = bids.length;
        res.status(200).json({ bids, totalRecords })
    } catch (error) {
        LogError("/bid/:page", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Get bids/proposal for a specific GC with pagination
router.get("/GCbids", authenticate, async (req: IRequest, res: Response) => {
    if (req?.user?.role !== "generalContractor") {
        res.status(401).json({ message: "Oops! Unauthorized, General Contract can access proposals only!" }) // Unauthorized
        return;
    }
    try {
        const { page }: any = req.query.page;
        const pageNumber = parseInt(page)
        const recordsPerPage = 10;
        const generalContractor_ID = req?.user?._id;
        const postIDs = await Post.find({ gc: generalContractor_ID }, { _id: 1 }).sort({ createdAt: 1 }).limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const bids = await Bid.find({ post: { $in: postIDs?.map(obj => obj._id) } }).populate("SC").populate("post").sort({ createdAt: -1 });
        const totalRecords = bids.length;
        res.status(200).json({ bids, totalRecords })
    } catch (error) {
        LogError("/bid/:page", error)
        res.status(500).json({ message: "Server error" })
    }
})

export default router;