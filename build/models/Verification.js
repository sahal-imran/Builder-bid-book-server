"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const verificationSchema = new mongoose_1.default.Schema({
    otp: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expireAt: {
        type: Date,
        index: { expires: '10m' } // Set the expiration time here, '10m'
    }
});
const Verification = mongoose_1.default.models.Verification || mongoose_1.default.model("Verification", verificationSchema);
exports.default = Verification;
//# sourceMappingURL=Verification.js.map