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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const Log_1 = require("../utils/Log");
// Instances
const router = express_1.default.Router();
// Sign up
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //1)  Destructuring req.body to get all the data fields
        const { firstName, lastName, role, email, companyName, companyPhone, csiDivision, state, country, password, } = req.body;
        // 2) Creteing new user
        const newUser = yield User_1.default.create({
            firstName,
            lastName,
            email,
            role,
            companyName,
            companyPhone,
            csiDivision,
            state,
            country,
            password,
        });
        // 3) Sending response to the client
        res.status(201).json({
            status: "success",
            message: "User created successfully.",
            data: {
                user: newUser,
            },
        });
        (0, Log_1.LogSuccess)("Path", __dirname);
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Failed to create user.",
        });
        (0, Log_1.LogError)("Path", __dirname);
    }
}));
// Sign up
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // 1) Check if the email exists (check if user exists )
        const user = yield User_1.default.findOne({ email: email }).select("+password");
        //2) Show error message if user does not exists or if password is invalid
        if (!user || !(yield user.comparePassword(password, user.password))) {
            throw new Error("Please enter a valid email and password!");
        }
        // 3) Generate a token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        // 4) Send the token as an HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
        });
        // 5) Sending response to the client
        res.status(200).json({
            status: "success",
            token,
            message: "User logged in successfully",
            data: {
                user,
            },
        });
    }
    catch (error) {
        res.status(401).json({
            status: "fail",
            message: error.message,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map