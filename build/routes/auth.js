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
const bcrypt_1 = __importDefault(require("bcrypt"));
// Instances
const router = express_1.default.Router();
// Sign up
router.get("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const password = yield bcrypt_1.default.hash(body.password, 10);
        const createUser = yield User_1.default.create(Object.assign(Object.assign({}, body), { password }));
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
            res.status(errorHandler.status).json({ message: errorHandler.message });
        }
        else if (errorHandler.status === 409) {
            (0, Log_1.LogWarning)("/signup(Duplication)", errorHandler.message);
            res.status(errorHandler.status).json({ message: errorHandler.message });
        }
        else {
            (0, Log_1.LogError)("/signup", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}));
// Sign up
router.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map