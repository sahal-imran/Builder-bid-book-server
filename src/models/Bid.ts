import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    post: { // Post against SB will bid
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    SC: { // SubContractor who bided
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposal: {
        type: String,
        required: true
    },
    attachment: {
        type: String, // it will be URL of pdf
        required: true
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: null },
    lastUpdateBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null,
    }
});

const Bid = mongoose.models.Bid || mongoose.model("Bid", bidSchema);

export default Bid;