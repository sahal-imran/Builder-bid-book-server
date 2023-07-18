import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    token: {
        type: String,
        default: null
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    expireAt: {
        type: Date,
        index: { expires: '1d' } // Set the expiration time here, '30m'
    }
});

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;