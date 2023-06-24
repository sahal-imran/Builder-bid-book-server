"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        default: null
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        index: { expires: '30m' } // Set the expiration time here, '30m'
    }
});
const Session = mongoose_1.default.models.Session || mongoose_1.default.model("Session", sessionSchema);
exports.default = Session;
//# sourceMappingURL=Session.js.map