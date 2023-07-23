"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
    },
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
    createdAt: { type: Date, default: new Date().toISOString() },
    updatedAt: { type: Date, default: null },
    lastUpdateBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        default: null,
    }
});
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map