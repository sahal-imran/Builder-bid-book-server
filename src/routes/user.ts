import express, { Request, Response } from 'express';
import { LogError, LogInfo, LogWarning } from '../utils/Log';
import Post from '../models/Post';
import authenticate from '../middleware/authenticate';
import User from '../models/User';

const router = express.Router();


interface IRequest extends Request {
    user: any;
}

// Get all venders(Sub-contractors) with filters and pagination;
router.post("/subcontractors", authenticate, async (req: IRequest, res: Response) => {
    try {
        const { page }: any = req.query;
        const pageNumber = parseInt(page)
        const recordsPerPage = 10;
        const filters = req.body;
        const SBs = await User.find({ ...filters, role: "subContractor" }).limit(recordsPerPage * 1).skip((pageNumber - 1) * recordsPerPage);
        const totalRecords = SBs.length;
        res.status(200).json({ SBs, totalRecords })
    } catch (error) {
        LogError("/user/subcontractors", error)
        res.status(500).json({ message: "Server error" })
    }
});

// get user data by ID
router.get("/user", authenticate, async (req: IRequest, res: Response) => {
    try {
        const _id = req?.user?._id;
        const user = await User.findById({ _id });
        res.status(200).json({user})
    } catch (error) {
        LogError("/user/user", error)
        res.status(500).json({ message: "Server error" })
    }
})


export default router;