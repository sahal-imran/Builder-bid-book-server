"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    companyName: {
        type: String,
        required: true,
        lowercase: true,
    },
    companyEmail: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
        lowercase: true,
    },
    county: {
        type: String,
        required: true,
        lowercase: true,
    },
    csiDivision: {
        type: String,
        lowercase: true,
        default: null
    },
    role: {
        type: String,
        required: true,
    },
    subscription: {
        type: Array,
        default: null
    },
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: new Date().toISOString() },
    lastUpdateBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        default: null,
    }
});
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map