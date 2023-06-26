"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bidSchema = new mongoose_1.default.Schema({
    post: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    SC: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposal: {
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
const Bid = mongoose_1.default.models.Bid || mongoose_1.default.model("Bid", bidSchema);
exports.default = Bid;
//# sourceMappingURL=Bid.js.map