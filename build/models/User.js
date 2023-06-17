"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Log_1 = require("../utils/Log");
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
        lowercase: true,
    },
    token: {
        type: String,
        default: null
    },
    subscription: {
        type: Array,
        default: null
    }
});
// ==> When user will login this function will call to generate token and store it in database for authentication
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let Token = jsonwebtoken_1.default.sign({ _id: this._id }, process.env.SECRET_KEY);
            this.token = Token;
            yield this.save();
            return Token;
        }
        catch (error) {
            (0, Log_1.LogError)("Login(generateAuthToken)", error);
        }
    });
};
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map