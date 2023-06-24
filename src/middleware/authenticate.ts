import { Request, Response, NextFunction } from 'express';
import { LogError, LogInfo, LogWarning } from '../utils/Log';
import Session from '../models/Session';
import User from '../models/User';
import MongoDBErrorController from '../utils/MongoDBErrorController';

interface IRequest extends Request {
    user: any;
}

const authenticate = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token: string = req.cookies.jwToken;
        const found: any = await Session.findOne({ token }).populate("user");
        if (found) {
            req.user = found?.user
            next();
        }
        else res.status(401).json({ message: "Oops! Unauthorized" }) // Unauthorized
    } catch (error) {
        const errorHandler: any = MongoDBErrorController(error)
        if (errorHandler.status === 403) {
            LogWarning("/authenticate(Validation)", errorHandler.message)
            res.status(errorHandler.status).json({ message: errorHandler.message })
        }
        else {
            LogError("authenticate", error)
            res.status(500).json({ message: "Server error" })
        }
    }
};

export default authenticate