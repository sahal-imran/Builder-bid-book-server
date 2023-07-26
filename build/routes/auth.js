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
const express_1 = __importDefault(require("express"));
const Log_1 = require("../utils/Log");
const User_1 = __importDefault(require("../models/User"));
const MongoDBErrorController_1 = __importDefault(require("../utils/MongoDBErrorController"));
const sendMail_1 = __importDefault(require("../lib/sendMail"));
const Session_1 = __importDefault(require("../models/Session"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const md5_1 = __importDefault(require("md5"));
const OtpGenerator_1 = __importDefault(require("../utils/OtpGenerator"));
const Verification_1 = __importDefault(require("../models/Verification"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
// Instances
const router = express_1.default.Router();
// Sign up
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const createUser = yield User_1.default.create(Object.assign(Object.assign({}, body), { password: (0, md5_1.default)(body.password) }));
        (0, sendMail_1.default)(createUser === null || createUser === void 0 ? void 0 : createUser.companyEmail, "Welcome", "Hi Welcome to the app", (error) => {
            if (error)
                (0, Log_1.LogError)("/signup(sendMail)", error);
            res.status(201).json({ message: "Registered" });
        });
    }
    catch (error) {
        const errorHandler = (0, MongoDBErrorController_1.default)(error);
        if (errorHandler.status === 403) {
            (0, Log_1.LogWarning)("/signup(Validation)", errorHandler.message);
            res.status(errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler.status).json({ message: errorHandler.message });
        }
        else if (errorHandler.status === 409) {
            (0, Log_1.LogWarning)("/signup(Duplication)", errorHandler.message);
            res.status(errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler.status).json({ message: errorHandler.message });
        }
        else {
            (0, Log_1.LogError)("(auth)/signup", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}));
// Login up
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const currentUser = yield User_1.default.findOne({ companyEmail: email });
        if (currentUser) {
            const match = (0, md5_1.default)(password) === currentUser.password;
            if (match) {
                let token = jsonwebtoken_1.default.sign({ _id: currentUser._id }, process.env.SECRET_KEY);
                yield Session_1.default.create({ token, user: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id, expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }); // store token in Session collection which will expire in 30min
                res.cookie('jwToken', token, {
                    maxAge: 86400000,
                    httpOnly: true,
                    secure: process.env.MODE === 'production',
                    sameSite: process.env.MODE === 'production' ? 'none' : 'lax', // Set to 'Lax' for localhost, 'none' for deployment to allow cross-site cookies
                });
                res.cookie('role', currentUser === null || currentUser === void 0 ? void 0 : currentUser.role, {
                    maxAge: 86400000, // Cookie expiration time (in milliseconds)
                    // httpOnly: true, // Restrict cookie access to HTTP only
                    // secure: process.env.MODE === 'production', // Set to true for deployment (HTTPS), false for localhost (HTTP)
                    // sameSite: process.env.MODE === 'production' ? 'none' : 'lax', // Set to 'Lax' for localhost, 'none' for deployment to allow cross-site cookies
                });
                res.status(200).json({ message: "successfully logged in", role: currentUser === null || currentUser === void 0 ? void 0 : currentUser.role });
            }
            else
                res.status(401).json({ message: "Invalid password" }); // Unauthorized
        }
        else
            res.status(401).json({ message: "Email not exist" }); // Unauthorized
    }
    catch (error) {
        (0, Log_1.LogError)("(auth)/login", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Logout 
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwToken;
        yield Session_1.default.findOneAndDelete({ token });
        res.clearCookie('jwToken');
        res.status(200).json({ message: "logged out" });
    }
    catch (error) {
        (0, Log_1.LogError)("(auth)/logout", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Get code on email
router.post("/getCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const match = yield User_1.default.findOne({ companyEmail: email });
        if (!match) {
            res.status(404).json({ message: "Email not exist" });
            return;
        }
        const otp = (0, OtpGenerator_1.default)();
        const saved = yield Verification_1.default.create({ otp, user: match === null || match === void 0 ? void 0 : match._id, expireAt: new Date(Date.now() + 600000) });
        if (saved) {
            (0, sendMail_1.default)(match === null || match === void 0 ? void 0 : match.companyEmail, "One time OTP", `OTP: ${otp}, don't share it with anyone else`, (error) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    (0, Log_1.LogError)("(auth)/getCode", error);
                    yield Verification_1.default.findByIdAndDelete({ _id: saved._id });
                    res.status(500).json({ message: "Unable to send otp" });
                }
                else {
                    res.status(201).json({ message: "Otp sent", _id: match === null || match === void 0 ? void 0 : match._id });
                }
            }));
        }
        else
            res.status(200).json({ message: "Unable to send otp" });
    }
    catch (error) {
        (0, Log_1.LogError)("(auth)/getCode", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Verify OTP
router.post("/verifyCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, _id } = req.body;
        const match = yield Verification_1.default.findOne({ user: _id, otp });
        if (match)
            res.status(200).json({ message: "Verification successful", _id: match === null || match === void 0 ? void 0 : match.user });
        else
            res.status(401).json({ message: "otp expired" });
    }
    catch (error) {
        (0, Log_1.LogError)("(auth)/verifyCode", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Password Reset
router.post("/resetPassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, _id } = req.body;
        yield User_1.default.findByIdAndUpdate({ _id }, { password: (0, md5_1.default)(password), updatedAt: new Date().toISOString(), lastUpdateBy: _id });
        res.status(200).json({ message: "Password recovered successfully" });
    }
    catch (error) {
        (0, Log_1.LogError)("(auth)/resetPassword", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// get role for authorization
router.get("/getRole", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const match = yield Subscription_1.default.findOne({ user });
        res.status(200).json({ role: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.role, status: !match ? null : match === null || match === void 0 ? void 0 : match.status });
    }
    catch (error) {
        (0, Log_1.LogError)("(auth)/getRole", error);
        res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map