import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { LogError } from "../utils/Log";

const sessionSchema = new mongoose.Schema({
    token: {
        type: String,
        default: null
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        index: { expires: '30m' } // Set the expiration time here, '30m'
    }
});

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;