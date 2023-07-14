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
                yield Session_1.default.create({ token, user: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id }); // store token in Session collection which will expire in 30min
                res.cookie('jwToken', token, {
                    maxAge: 1800000,
                    httpOnly: true,
                    secure: process.env.MODE === 'production',
                    sameSite: process.env.MODE === 'production' ? 'none' : 'lax', // Set to 'Lax' for localhost, 'none' for deployment to allow cross-site cookies
                });
                res.cookie('role', currentUser === null || currentUser === void 0 ? void 0 : currentUser.role, {
                    maxAge: 1800000,
                    httpOnly: true,
                    secure: process.env.MODE === 'production',
                    sameSite: process.env.MODE === 'production' ? 'none' : 'lax', // Set to 'Lax' for localhost, 'none' for deployment to allow cross-site cookies
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
exports.default = router;
//# sourceMappingURL=auth.js.map