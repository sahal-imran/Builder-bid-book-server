import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    gc: { // General contractor who will make post
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    address: {
        type: String,
        lowercase: true,
        required: true
    },
    csiDivision: {
        type: String,
        lowercase: true,
        required: true
    },
    county: {
        type: String,
        lowercase: true,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    attachment: {
        type: String, // it will be URL pdf
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

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;