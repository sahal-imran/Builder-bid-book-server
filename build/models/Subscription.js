"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema = new mongoose_1.default.Schema({
    customer: {
        type: String,
        required: true
    },
    subscription: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        default: null
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: null },
});
const Subscription = mongoose_1.default.models.Subscription || mongoose_1.default.model("Subscription", subscriptionSchema);
exports.default = Subscription;
//# sourceMappingURL=Subscription.js.map