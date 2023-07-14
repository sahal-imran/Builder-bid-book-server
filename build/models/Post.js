"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    gc: {
        type: mongoose_1.default.Types.ObjectId,
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
        type: String,
        required: true
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: null },
    lastUpdateBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        default: null,
    }
});
const Post = mongoose_1.default.models.Post || mongoose_1.default.model("Post", postSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map